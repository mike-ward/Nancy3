import m from 'mithril';
import { grid } from '../grid/grid';
import { loading } from '../loading/loading'
import { IGridOptions, IGridColumn } from '../grid/IGridOptions';
import { camelIdentifierToTitle } from '../../services/convert-service';

export const stocks: m.Component = {
  oninit: oninit,
  view: view
}

const model = {
  stocks: null as IGridOptions
}

function oninit() {
  getStocks()
    .then(r => { model.stocks = gridOptionsFactory(r) });
}

function view() {
  return m('div',
    m('h2', `Stocks`),
    m('p', `Count: ${model.stocks ? model.stocks.data.length : 0}`),
    model.stocks
      ? m(grid, { gridOptions: model.stocks, style: { 'font-size': 'smaller' } } as any)
      : m(loading));
}

function getStocks() {
  return m.request({ url: 'api/markets/symbols', data: Date.now() });
}

function gridOptionsFactory(data: any) {
  const fields = ['symbol', 'name', 'date', 'type'];

  const columns: IGridColumn[] = fields
    .map(field => ({
      id: field,
      title: camelIdentifierToTitle(field),
      allowSort: true,
    }));

  return {
    columns: columns,
    data: data
  };
}
