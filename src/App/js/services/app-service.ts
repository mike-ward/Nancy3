import m from 'mithril';
import 'purecss/build/pure-min.css';
import { addStyleSheet } from './dom-service';

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
  addStyleSheet(`
    #app { margin: 1em }
    .bold { font-weight: bold }
    .italic { font-style: italic }
  `);

  const root = document.getElementById('app') as Element;

  m.route(
    root, 'splash',
    {
      // Pages
      'splash': page(splash),
      'news': auth(page(news)),
      'markets': auth(page(markets)),
      'stocks': auth(page(stocks)),
      'about': page(about),

      // Account
      'account/login': login
    });

  function page(component: m.Component): m.Component {
    return {
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