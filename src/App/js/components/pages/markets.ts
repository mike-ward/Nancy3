﻿import m from 'mithril';
import stream from 'mithril/stream';
import { grid as gridControl } from '../grid/grid';
import { loading } from '../loading/loading';
import { IGridModel, IGridColumn } from '../grid/grid-interfaces';
import { camelIdentifierToTitle } from '../../services/convert-service';
import { cssStylesAdd } from '../../services/css-service';
import { tableToCsv } from '../../services/export-csv-service';
import { tableToExcel } from '../../services/export-excel-service';

// language=css
cssStylesAdd(`div.markets .grid{font-size:smaller;}`);

export const markets: m.Component = {
  view: view,
  oninit: oninit
};

interface IMarket {
  id: string;
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
    mostActive: { id: 'ma', title: 'Most Active Stocks', model: stream() } as IMarket,
    gainers: { id: 'ga', title: 'Gainers', model: stream() } as IMarket,
    losers: { id: 'lo', title: 'Losers', model: stream() } as IMarket
  }
}

function view() {
  const markets = [model.mostActive, model.gainers, model.losers];
  return m('.markets',
    m('.page-title', 'Markets'),
    markets.map(market => [
      title(market),
      grid(market),
      csvButton(market),
      excelButton(market)
    ])
  );
}

function title(market: IMarket) {
  return m('p',
    market.model()
      ? m('span.bold', market.title)
      : m(loading));
}

function grid(market: IMarket) {
  return m(gridControl, { id: market.id, model: market.model });
}

function csvButton(market: IMarket) {
  return m('button.button-small',
    {
      style: {
        'margin-top': '1em',
        'font-size': 'smaller',
        visibility: market.model() ? 'visible' : 'hidden'
      },
      onclick: () => tableToCsv(document.getElementById(market.id) as any, market.title + '.csv')
    },
    'Export to CSV');
}

function excelButton(market: IMarket) {
  return m('button.button-small',
    {
      style: {
        'margin-top': '1em',
        'margin-left': '1em',
        'font-size': 'smaller',
        visibility: market.model() ? 'visible' : 'hidden'
      },
      onclick: () => tableToExcel(document.getElementById(market.id) as any, market.title, market.title + '.xls')
    },
    'Export to Excel');
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
  const stringFields = ['symbol', 'companyName', 'primaryExchange', 'sector'];
  const numberFields = ['latestPrice', 'open', 'close', 'high', 'low', 'week52High', 'week52Low']
  const isNumberField = (field: string) => numberFields.some(nf => nf === field);

  const columns: IGridColumn[] = stringFields.concat(numberFields)
    .map(field => ({
      id: field,
      name: camelIdentifierToTitle(field),
      css: isNumberField(field)
        ? { 'text-align': 'right' }
        : null,
      sortEnable: true,
      cellRenderer: isNumberField(field)
        ? val => val.toFixed(2)
        : null
    }) as IGridColumn);

  return { columns: columns, data: data };
}