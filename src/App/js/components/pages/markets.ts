import m from 'mithril';
import { grid } from '../grid/grid';
import { loading } from '../loading/loading';
import { IGridOptions, IGridColumn } from '../grid/IGridOptions';
import { camelIdentifierToTitle } from '../../services/convert-service';
import { cssStylesAdd } from '../../services/css-service';

// language=css
cssStylesAdd(`div.markets .grid { font-size: smaller; }`);

export const markets: m.Component = {
  oninit: oninit,
  view: view
}

const model = {
  mostActive: {} as IGridOptions,
  gainers: {} as IGridOptions,
  losers: {} as IGridOptions
}

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
      m('p.bold', mdl.columns ? mdl.meta : m(loading)),
      m(grid, { gridOptions: mdl } as any)
    ])
  );
}

function api(url: string) {
  return m.request({ url: url, data: Date.now() });
}

function getMostActive() {
  api('api/markets/most-active')
    .then(r => { model.mostActive = gridOptions('Most Active Stocks', r) });
}

function getGainers() {
  api('api/markets/gainers')
    .then(r => { model.gainers = gridOptions('Gainers', r) });
}

function getLosers() {
  api('api/markets/losers')
    .then(r => { model.losers = gridOptions('Losers', r) });
}

function gridOptions(title: string, data: any) {
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

  return { columns: columns, data: data, meta: title };
}
