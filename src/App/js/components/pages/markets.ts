import m from 'mithril';
import { grid } from '../grid/grid';
import { loading } from '../loading/loading';
import { IGridOptions, IGridColumn } from '../grid/IGridOptions';
import { camelIdentifierToTitle } from '../../services/convert-service';
import { addStyleSheet } from '../../services/dom-service';

let mostActive = {} as IGridOptions;
let gainers = {} as IGridOptions;
let losers = {} as IGridOptions;

const fields = ['symbol', 'companyName', 'primaryExchange', 'sector', 'latestPrice', 'open', 'close', 'high', 'low', 'week52High', 'week52Low'];

function view() {
  return m('.markets', 
    m('h2', 'Markets'),
    mostActive.columns ? m('p.bold', 'Most Active Stocks') : m(loading),
    m(grid, { gridOptions: mostActive } as any),
    gainers.columns ? m('p.bold', 'Gainers') : m(loading),
    m(grid, { gridOptions: gainers } as any),
    losers.columns ? m('p.bold', 'Losers') : m(loading),
    m(grid, { gridOptions: losers } as any)
  );
}

function oninit() {
  getMostActive()
    .then(r => { mostActive = buildGridOptions(fields, r) });

  getGainers()
    .then(r => { gainers = buildGridOptions(fields, r) });

  getLosers()
    .then(r => { losers = buildGridOptions(fields, r) });
}

function getMostActive() {
  return m.request({ url: 'api/markets/most-active', data: Date.now() });
}

function getGainers() {
  return m.request({ url: 'api/markets/gainers', data: Date.now() });
}

function getLosers() {
  return m.request({ url: 'api/markets/losers', data: Date.now() });
}

function buildGridOptions(fields: string[], data: any) {
  const columns: IGridColumn[] = fields
    .map(field => ({
      id: field,
      title: camelIdentifierToTitle(field),
      allowSort: true,
    }));
  return { columns: columns, data: data };
}

// language=css
const css = `div.markets .grid { font-size: smaller; }`;
addStyleSheet(css);

export const markets = {
  view: view,
  oninit: oninit
}