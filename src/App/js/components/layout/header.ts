import m from 'mithril';
import constants from '../../services/constants-service';
import { cssStylesAdd } from '../../services/css-service';
import { userBar } from './user-bar';
import { navBar } from './nav-bar';

// language=CSS
cssStylesAdd(`.header{clear:both;text-align:center;}`);

const navbarOptions = {
  items: [
    { name: 'News', link: 'news' },
    { name: 'Markets', link: 'markets' },
    { name: 'Stocks', link: 'stocks' },
    { name: 'About', link: 'about' }
  ]
}

export const header = {
  view: view
}

function view() {
  return m('.header',
    m(userBar),
    m('h1[style=clear:both]', constants.appTitle),
    m(navBar, { 'options': navbarOptions } as any),
    m('hr')
  );
}
