import m from 'mithril';
import stream from 'mithril/stream';
import { IGridModel, IGridDataRow, IGridColumn } from './IGridModel';
import { gridViewModel, IGridViewModel } from './gridViewModel';
import { cssStylesAdd } from '../../services/css-service';

// language=CSS
cssStylesAdd(`
  .grid th, .grid td{white-space:nowrap;}
  .grid-cell-click-action{cursor:pointer;}
  .grid-cell-click:hover{text-decoration:underline;}
  .grid-sort-indicator:hover, .grid-sort-indicator-up, .grid-sort-indicator-dn{cursor:pointer;}
  .grid-sort-indicator-hi:after{content:'▲';visibility:hidden}
  .grid-sort-indicator-up:after{content:'▲'}
  .grid-sort-indicator-dn:after{content:'▼'}
`);

export interface IGridAttrs extends m.Attributes {
  model: stream.Stream<IGridModel>
}

export const grid: m.FactoryComponent<IGridAttrs> = () => {
  let vm = null as IGridViewModel;

  return {
    oninit: vn => vm = gridViewModel(vn.attrs.model),

    view: vn => vm.model()()
      ? m('table.grid.pure-table.pure-table-bordered', vn.attrs,
        thead(vm),
        tbody(vm))
      : null
  }
}

function thead(vm: IGridViewModel) {
  const columns = vm.model()().columns;
  return m('thead', m('tr', columns.map(column => th(column, vm))));
}

function th(column: IGridColumn, vm: IGridViewModel) {
  const classes = [] as string[];

  if (column.allowSort) {
    classes.push('grid-sort-indicator');
    const direction = vm.sortByDirection(column.id);
    if (direction === 0) classes.push('grid-sort-indicator-hi');
    else if (direction > 0) classes.push('grid-sort-indicator-up');
    else classes.push('grid-sort-indicator-dn');
  }

  return m('th',
    {
      className: classes.join(' '),
      title: column.headTooltip || undefined,
      onclick: column.allowSort ? () => vm.updateSortState(column.id) : undefined
    },
    column.title);
}

function tbody(vm: IGridViewModel) {
  // see https://mithril.js.org/keys.html
  const model = vm.model()();
  const key = model.key;
  const getKey = key
    ? (key instanceof Function)
      ? (row: any) => (key as Function)(row)
      : (row: any) => row[key as string]
    : (): undefined => undefined;

  return m('tbody',
    model.data.map(row =>
      m('tr',
        { key: getKey(row) },
        model.columns.map(column => td(column, row)))));
}

function td(column: IGridColumn, row: IGridDataRow, ) {
  const val = row[column.id];
  const value: any = val === null || val === undefined ? column.contentIfNull : val;
  const renderedValue = column.cellRenderer ? column.cellRenderer(value, column) : value;
  const cellClass = column.cellClick ? 'grid-cell-click' : undefined;
  const tooltip = column.cellTooltip ? column.cellTooltip(value, renderedValue, column) : undefined;
  const clickHandler = () => column.cellClick ? column.cellClick(value, renderedValue, column) : undefined;

  return m('td',
    {
      className: cellClass,
      title: tooltip,
      onclick: clickHandler
    },
    renderedValue);
}
