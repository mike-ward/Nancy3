import m from 'mithril';
import { grid, IGridAttrs } from '../grid/grid';
import { loading } from '../loading/loading';
import { IGridModel, IGridColumn } from '../grid/IGridModel';
import { camelIdentifierToTitle } from '../../services/convert-service';
import { cssStylesAdd } from '../../services/css-service';

// language=css
cssStylesAdd(`div.markets .grid{font-size:smaller;}`);

export const markets: m.Component = {
  oninit: oninit,
  view: view
};

interface IMarket {
  title: string;
  model: IGridModel;
}

const model = {
  mostActive: { title: 'Most Active Stocks', model: null } as IMarket,
  gainers: { title: 'Gainers', model: null } as IMarket,
  losers: { title: 'Losers', model: null } as IMarket
};

function oninit() {
  getMostActive();
  getGainers();
  getLosers();
}

function view() {
  const markets = [model.mostActive, model.gainers, model.losers];
  return m('.markets',
    m('h2', 'Markets'),
    markets.map(market => [
      m('p',
        market.model
        ? m('span.bold', market.title)
        : m(loading)),
      m(grid, { model: market.model } as IGridAttrs)
    ])
  );
}

function api(url: string) {
  return m.request({ url: url, data: Date.now() });
}

function getMostActive() {
  api('api/markets/most-active')
    .then(r => { model.mostActive.model = gridModelFactory(r) });
}

function getGainers() {
  api('api/markets/gainers')
    .then(r => { model.gainers.model = gridModelFactory(r) });
}

function getLosers() {
  api('api/markets/losers')
    .then(r => { model.losers.model = gridModelFactory(r) });
}

function gridModelFactory(data: any) {
  const fields = [
    'symbol', 'companyName', 'primaryExchange', 'sector', 'latestPrice',
    'open', 'close', 'high', 'low', 'week52High', 'week52Low'
  ];

  const columns: IGridColumn[] = fields
    .map(field => ({
      id: field,
      title: camelIdentifierToTitle(field),
      allowSort: true,
    }));

  return { columns: columns, data: data };
}