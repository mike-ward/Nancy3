import m from 'mithril';
import { grid } from '../grid/grid';
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
  gridModel: IGridModel;
}

const model = {
  mostActive: { title: 'Most Active Stocks', gridModel: null } as IMarket,
  gainers: { title: 'Gainers', gridModel: null } as IMarket,
  losers: { title: 'Losers', gridModel: null } as IMarket
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
    markets.map(mdl => [
      m('p',
        mdl.gridModel
        ? m('span.bold', mdl.title)
        : m(loading)),
      m(grid, { gridModel: mdl.gridModel } as any)
    ])
  );
}

function api(url: string) {
  return m.request({ url: url, data: Date.now() });
}

function getMostActive() {
  api('api/markets/most-active')
    .then(r => { model.mostActive.gridModel = gridModel(r) });
}

function getGainers() {
  api('api/markets/gainers')
    .then(r => { model.gainers.gridModel = gridModel(r) });
}

function getLosers() {
  api('api/markets/losers')
    .then(r => { model.losers.gridModel = gridModel(r) });
}

function gridModel(data: any) {
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