import m from 'mithril';
import { grid } from '../grid/grid';
import { IGridOptions, IGridColumn } from '../grid/IGridOptions';
import { camelIdentifierToTitle } from '../../services/convert-service';
import { addStyleSheet } from '../../services/dom-service';

let mostActive = {} as IGridOptions;
let gainers = {} as IGridOptions;
let losers = {} as IGridOptions;

const fields = ['symbol', 'companyName', 'primaryExchange', 'sector', 'latestPrice', 'open', 'close', 'high', 'low', 'week52High', 'week52Low'];

function view() {
  return m('div', 
    m('h2', 'Markets'),
    m('p[style="font-weight:bold"]', mostActive.columns ? 'Most Active Stocks' : ''),
    m(grid as any, { 'class': 'markets-grid', gridOptions: mostActive }),
    m('p[style="font-weight:bold"]', gainers.columns ? 'Gainers' : ''),
    m(grid as any, { 'class': 'markets-grid', gridOptions: gainers }),
    m('p[style="font-weight:bold"]', losers.columns ? 'Losers' : ''),
    m(grid as any, { 'class': 'markets-grid', gridOptions: losers })
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
const css = `.markets-grid { font-size: smaller; }`;
addStyleSheet(css);

export const markets = {
  view: view,
  oninit: oninit
}