import m from 'mithril';
import stream from 'mithril/stream';
import { grid } from '../grid/grid';
import { loading } from '../loading/loading';
import { IGridModel, IGridColumn } from '../grid/IGridModel';
import { camelIdentifierToTitle } from '../../services/convert-service';
import { cssStylesAdd } from '../../services/css-service';

// language=css
cssStylesAdd(`div.markets .grid{font-size:smaller;}`);

export const markets: m.Component = {
  view: view,
  oninit: oninit
};

interface IMarket {
  title: string;
  model: stream.Stream<IGridModel>;
}

interface IModel {
  mostActive: IMarket;
  gainers: IMarket;
  losers: IMarket;
}

let model: IModel;

function oninit() {
  model = initModel();
  getMostActive();
  getGainers();
  getLosers();
}

function initModel() {
  return {
    mostActive: { title: 'Most Active Stocks', model: stream() } as IMarket,
    gainers: { title: 'Gainers', model: stream() } as IMarket,
    losers: { title: 'Losers', model: stream() } as IMarket
  }
}

function view() {
  const markets = [model.mostActive, model.gainers, model.losers];
  return m('.markets',
    m('h2', 'Markets'),
    markets.map(market => [
      m('p',
        market.model()
        ? m('span.bold', market.title)
        : m(loading)),
      m(grid, { model: market.model })
    ])
  );
}

function api(url: string) {
  return m.request({ url: url, data: Date.now() });
}

function getMostActive() {
  api('api/markets/most-active')
    .then(r => { model.mostActive.model(gridModelFactory(r)) });
}

function getGainers() {
  api('api/markets/gainers')
    .then(r => { model.gainers.model(gridModelFactory(r)) });
}

function getLosers() {
  api('api/markets/losers')
    .then(r => { model.losers.model(gridModelFactory(r)) });
}

function gridModelFactory(data: any) {
  const fields = [
    'symbol', 'companyName', 'primaryExchange', 'sector', 'latestPrice',
    'open', 'close', 'high', 'low', 'week52High', 'week52Low'
  ];

  const columns: IGridColumn[] = fields
    .map(field => ({
      id: field,
      name: camelIdentifierToTitle(field),
      sortAllow: true,
    }));

  return { columns: columns, data: data };
}