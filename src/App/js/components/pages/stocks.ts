import m from 'mithril';
import { grid } from '../grid/grid';
import { loading } from '../loading/loading'
import { IGridOptions, IGridColumn } from '../grid/IGridOptions';
import { camelIdentifierToTitle } from '../../services/convert-service';

let stockOptions: IGridOptions;
const fields = ['symbol', 'name', 'date', 'type'];

function view() {
  return m('div',
    m('h2', `Stocks`),
    m('p', `Count: ${stockOptions ? stockOptions.data.length : 0}`),
    stockOptions
      ? m(grid, { gridOptions: stockOptions, style: { 'font-size': 'smaller' } } as any)
      : m(loading));
}

function oninit() {
  getStocks()
    .then(r => { stockOptions = buildGridOptions(fields, r) });
}

function getStocks() {
  return m.request({ url: 'api/markets/symbols', data: Date.now() });
}

function buildGridOptions(fields: string[], data: any) {
  const columns: IGridColumn[] = fields
    .map(field => ({
      id: field,
      title: camelIdentifierToTitle(field),
      allowSort: true,
    }));

  return { columns: columns, data: data, key: 'symbol' };
}

export const stocks = {
  view: view,
  oninit: oninit
}

