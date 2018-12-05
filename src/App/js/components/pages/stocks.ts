import m from 'mithril';
import { grid, IGridAttrs } from '../grid/grid';
import { loading } from '../loading/loading'
import { IGridModel, IGridColumn } from '../grid/IGridModel';
import { camelIdentifierToTitle } from '../../services/convert-service';

export const stocks: m.Component = {
  view: view,
  oninit: oninit,
  onremove: onremove
}

interface IModel {
  stocks: IGridModel;
}

let model: IModel;

function view() {
  return m('div',
    m('h2', `Stocks`),
    m('p', `Count: ${model.stocks ? model.stocks.data.length : 0}`),
    model.stocks
    ? m(grid, { model: model.stocks, style: { 'font-size': 'smaller' } } as IGridAttrs)
    : m(loading));
}

function oninit() {
  model = initModel();
  getStocks()
    .then(r => { model.stocks = gridModelFactory(r) });
}

function onremove() {
  model = initModel();
}

function initModel() {
  return {
    stocks: null as IGridModel
  }
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
