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

export var startApp = update => model => {
    addStyleSheet(
      `
  #app { margin: 1em }
  .bold { font-weight: bold }
  .italic { font-style: italic }
`);

    const page = vnode => ({
      view: () => m(layout, m(vnode))
    });

    const auth = vnode => ({
      onmatch: () => {
        // todo: check authentication
        return page(vnode);
      }
    });

  const emptyComponent = {
    view: () => ''
  };

  const router = component => {
    update(() => model.component = component);
    return { onmatch: () => new Promise((a, b) => emptyComponent) }
  }
    
  const root = document.getElementById('app') as Element;

  m.route(
    root, 'splash',
    {
      // Pages
      'splash': router(page(splash)),
      'news': router(auth(news)),
      'markets': auth(markets),
      'stocks': auth(stocks),
      'about': page(about),

      // Account
      'account/login': login
    });
}