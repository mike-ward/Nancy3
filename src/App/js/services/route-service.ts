﻿import m from 'mithril';
import constants from './constants-service';

// Pages
import { layout } from '../components/layout/layout';
import { splash } from '../components/pages/splash';
import { news } from '../components/pages/news';
import { markets } from '../components/pages/markets';
import { stocks } from '../components/pages/stocks';
import { about } from '../components/pages/about';

// Account
import { login } from '../components/pages/account/login';

const root = document.getElementById('app') as Element;

export function buildRoutes() {
  m.route(root,'',
    {
      // Pages
      '': page(splash, 'Splash'),
      'news': auth(page(news, 'News')),
      'markets': auth(page(markets, 'Markets')),
      'stocks': auth(page(stocks, 'Stocks')),
      'about': page(about, 'About'),

      // Account
      'account/login': login
    });
}

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
