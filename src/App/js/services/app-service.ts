import m from 'mithril';
import 'purecss/build/pure-min.css';
import constants from './constants-service';
import { cssStylesAdd, cssStylesInject } from './css-service';

// Pages
import { layout } from '../components/layout/layout';
import { splash } from '../components/pages/splash';
import { news } from '../components/pages/news';
import { markets } from '../components/pages/markets';
import { stocks } from '../components/pages/stocks';
import { about } from '../components/pages/about';

// Account
import { login } from '../components/pages/account/login';

export function startApp() {
  // language=css
  cssStylesAdd(`
    #app { margin: 1em }
    .bold { font-weight: bold }
    .italic { font-style: italic }
  `);

  cssStylesInject();
  const root = document.getElementById('app') as Element;

  m.route(
    root, 'splash',
    {
      // Pages
      'splash': page(splash, 'Splash'),
      'news': auth(page(news, 'News')),
      'markets': auth(page(markets, 'Markets')),
      'stocks': auth(page(stocks, 'Stocks')),
      'about': page(about, 'About'),

      // Account
      'account/login': login
    });

  function page(component: m.Component, title: string): m.Component {
    return {
      oncreate: () => document.title = `${constants.appTitle} - ${title}`,
      onremove: () => document.title = `${constants.appTitle}`,
      view: () => m(layout, m(component))
    }
  }

  function auth(component: m.Component): m.RouteResolver {
    return {
      onmatch: () => {
        // todo: check authentication
        return component;
      }
    }
  }
}