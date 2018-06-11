import m from 'mithril';
import { addStyleSheet, decodeHtml } from '../../services/dom-service';
import { dateToLocaleString } from '../../services/convert-service';

// language=css
addStyleSheet(`
  .new-item{margin-bottom:2em;}
  .home-date-time{font-weight:bold;margin:-1em 0 1em 0;}`);

const timerField = 'timer';

export const news = {
  view: view,
  oninit: oninit,
  onremove: (v: m.Vnode) => clearInterval(v.state[timerField])
};

const model = {
  news: [],
  time: Date.now(),
};

function oninit(v: m.Vnode): void {
  updateNews();
  v.state[timerField] = setInterval(updateTime, 1000);
}

function view(): m.Vnode {
  return m(
    'div',
    [
      m('h2', 'News'),
      m('p', new Date(model.time).toLocaleString()),
      m('div', model.news.map((item: any) => newsNode(item)))
    ]);
}

function updateNews() {
  m.request({ url: 'api/markets/news', data: Date.now() })
    .then(r => model.news = r as any);
}

function updateTime() {
  model.time = Date.now();
  m.redraw();
}

function newsNode(item: any): m.Vnode {
  const vn = m(
    '.news-item',
    [
      m('h3', [m('a', { href: item.url, target: '_blank' } as any, decodeHtml(item.headline))]),
      m('div.home-date-time', dateToLocaleString(item.datetime)),
      m('p', decodeHtml(item.summary)),
      m('p', 'source: ', m('em', decodeHtml(item.source)))
    ]);

  return vn;
}
