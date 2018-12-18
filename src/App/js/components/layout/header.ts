import m from 'mithril';
import constants from '../../services/constants-service';
import { cssStylesAdd } from '../../services/css-service';
import { navBar, INavbarOptions } from './nav-bar';

cssStylesAdd(
  `nav{margin-bottom:0.5rem}
  .mobile-menu{display:none;position:absolute;top:15px;right:15px;z-index:10}`);

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
    m('.nav-container',
      m('.nav-logo', constants.appTitle),
      m(navBar, { options: navbarOptions, menuType: 'nav-links' } as any),
      m('a.mobile-menu-toggle', { onclick: click },
        m(navBar, { options: navbarOptions, menuType: 'mobile-menu.menu' } as any)
      ))
  );
}

function click() {
  const mobileMenu = document.getElementsByClassName('mobile-menu')[0] as any;
  mobileMenu.style.display = !mobileMenu.style.display ? 'block' : '';
}