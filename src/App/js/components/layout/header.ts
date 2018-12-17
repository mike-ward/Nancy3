import m from 'mithril';
import constants from '../../services/constants-service';
import { cssStylesAdd } from '../../services/css-service';
import { userBar } from './user-bar';
import { navBar, INavbarOptions } from './nav-bar';

// language=CSS
cssStylesAdd(`nav{margin-bottom:0.5rem}`);

const navbarOptions: INavbarOptions = {
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
  return m('nav',
    m('.nav-container]',
      m('.nav-logo', constants.appTitle),
      //m(userBar),
      m(navBar, { 'options': navbarOptions } as any),
    )
  );
}