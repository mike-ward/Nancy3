import m from 'mithril';
import { grid } from '../grid/grid';
import { loading } from '../loading/loading'
import { IGridModel, IGridColumn } from '../grid/IGridModel';
import { camelIdentifierToTitle } from '../../services/convert-service';

export const stocks: m.Component = {
  oninit: oninit,
  view: view
}

const model = {
  stocks: null as IGridModel
}

function oninit() {
  getStocks()
    .then(r => { model.stocks = gridModelFactory(r) });
}

function view() {
  return m('div',
    m('h2', `Stocks`),
    m('p', `Count: ${model.stocks ? model.stocks.data.length : 0}`),
    model.stocks
      ? m(grid, { gridModel: model.stocks, style: { 'font-size': 'smaller' } } as any)
      : m(loading));
}

function getStocks() {
  return m.request({ url: 'api/markets/symbols', data: Date.now() });
}

function gridModelFactory(data: any) {
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
