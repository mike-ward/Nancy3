﻿declare var module: any;
module.hot && module.hot.accept();

// true if IE less than 9
if (!-[1,]) alert('Internet Explorer 7 and 8 are not supported');

import m from 'mithril';
import 'purecss/build/pure-min.css';
import { addStyleSheet } from './services/dom-service';

// Pages
import { layout } from './components/layout/layout';
import { splash } from './components/pages/splash';
import { news } from './components/pages/news';
import { markets } from './components/pages/markets';
import { stocks } from './components/pages/stocks';
import { about } from './components/pages/about';

// Account
import { login } from './components/pages/account/login';

addStyleSheet(`
  #app { margin: 1em }
  .bold { font-weight: bold }
  .italic { font-style: italic }
`);

const page = content => ({
  view: () => m(layout, m(content))
});

const auth = content => ({
  onmatch: () => {
    // todo: check authentication
    return page(content);
  }
});

const root = document.getElementById('app') as Element;

m.route(root, 'splash', {
  // Pages
  'splash': page(splash),
  'news': auth(news),
  'markets': auth(markets),
  'stocks': auth(stocks),
  'about': page(about),

  // Account
  'account/login': login
  });