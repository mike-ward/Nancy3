import m from 'mithril';
import { decodeHtml } from '../../services/dom-service';
import { dateToLocaleString } from '../../services/convert-service';
import { cssStylesAdd } from '../../services/css-service';
import { loading } from '../loading/loading';

// language=css
cssStylesAdd(`
  .news-item{margin-bottom:2rem;max-width:60rem}
  .home-date-time{font-weight:bold;margin:-1rem 0 1rem 0;}`);

export const news = {
  view: view,
  oninit: oninit,
  onremove: onremove,
};

interface INews {
  url: string;
  headline: string;
  datetime: Date;
  summary: string;
  source: string;
}

interface IModel {
  news: INews[]
}

let model: IModel;

function initModel() {
  return {
    news: [] as INews[]
  }
}

function view(): m.Vnode {
  return m('div',
    m('h2', 'News'),
    m('div', model.news
      ? model.news.map((item: any) => newsNode(item))
      : m(loading))
  );
}

function oninit(): void {
  model = initModel();
  updateNews();
}

function onremove() {
  model = initModel();
}


function updateNews() {
  m.request({ url: 'api/markets/news', data: Date.now() })
    .then(r => model.news = r as any);
}

function newsNode(item: any): m.Vnode {
  const vn = m('.news-item',
    m('h3', [m('a', { href: item.url, target: '_blank' } as any, decodeHtml(item.headline))]),
    m('div.home-date-time', dateToLocaleString(item.datetime)),
    m('p', decodeHtml(item.summary)),
    m('p', 'source: ', m('em', decodeHtml(item.source)))
  );

  return vn;
}