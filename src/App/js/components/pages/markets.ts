import m from 'mithril';
import stream from 'mithril/stream';
import { grid } from '../grid/grid';
import { loading } from '../loading/loading';
import { IGridModel, IGridColumn } from '../grid/IGridModel';
import { camelIdentifierToTitle } from '../../services/convert-service';
import { cssStylesAdd } from '../../services/css-service';
import { downloadCsv, tableToExcel } from '../../services/download-service';

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
  csv: stream.Stream<string>;
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
    mostActive: { id: 'ma',  title: 'Most Active Stocks', model: stream(), csv: stream() } as IMarket,
    gainers: { id: 'ga', title: 'Gainers', model: stream(), csv: stream() } as IMarket,
    losers: { id: 'lo', title: 'Losers', model: stream(), csv: stream() } as IMarket
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
      m(grid, { id: market.id, model: market.model, csv: market.csv }),
      exportCsvButton(market),
      ' ',
      exportExcelButton(market)
    ])
  );
}

function exportCsvButton(market: IMarket) {
  return m('button.pure-button',
    {
      style: {
        'margin-top': '1em',
        'font-size': 'smaller',
        visibility: market.model() ? 'visible' : 'hidden'
      },
      onclick: () => downloadCsv(market.csv(), market.title + '.csv')
    },
    'Export to CSV');
}

function exportExcelButton(market: IMarket) {
  return m('button.pure-button',
    {
      style: {
        'margin-top': '1em',
        'font-size': 'smaller',
        visibility: market.model() ? 'visible' : 'hidden'
      },
      onclick: () => tableToExcel(document.getElementById(market.id), market.title, market.title)
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

  const columns: IGridColumn[] = stringFields.concat(numberFields)
    .map(field => ({
      id: field,
      name: camelIdentifierToTitle(field),
      css: numberFields.some(nf => nf === field)
        ? { 'text-align': 'right' }
        : null,
      sortEnable: true,
    }) as IGridColumn);

  return { columns: columns, data: data };
}