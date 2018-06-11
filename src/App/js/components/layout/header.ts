import m from 'mithril';
import constants from '../../services/constants-service';
import { addStyleSheet } from '../../services/dom-service';
import { userBar } from './user-bar';
import { navBar } from './nav-bar';

// language=CSS
const css = `.header{clear:both;text-align:center;}`;
addStyleSheet(css);

const navbarOptions = {
  items: [
    { name: 'Home', link: 'news' },
    { name: 'Markets', link: 'markets' },
    { name: 'Stocks', link: 'stocks' },
    { name: 'About', link: 'about' }
  ]
}

export const header = {
  view: view,
  css: css
}

function view() {
  return m(
    '.header', [
      m(userBar),
      m('h1[style=clear:both]', constants.appTitle),
      m(navBar, { 'options': navbarOptions } as any),
      m('hr')
    ]);
}
