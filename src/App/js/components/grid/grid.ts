import m from 'mithril';
import stream from 'mithril/stream';
import { IGridModel, IGridColumn } from './IGridModel';
import { gridViewModelStream, IGridViewModel, IGridViewCell } from './gridViewModel';
import { cssStylesAdd } from '../../services/css-service';

// language=CSS
cssStylesAdd(`
  table.grid {border:1px;border-collapse:collapse}
  .grid th {background-color: #ddd}
  .grid th,.grid td{white-space:nowrap;padding:.2em;text-align:left;border:1px solid #ddd}
  .grid-cell-click-action{cursor:pointer;}
  .grid-cell-click:hover{text-decoration:underline;}
  .grid-sort-indicator:hover, .grid-sort-indicator-up, .grid-sort-indicator-dn{cursor:pointer;}
  .grid-sort-indicator-hi:after{content:'▲';visibility:hidden}
  .grid-sort-indicator-hi:hover:after{visibility:visible;color:#ccd}
  .grid-sort-indicator-up:after{content:'▲'}
  .grid-sort-indicator-dn:after{content:'▼'}
`);

export interface IGridAttrs extends m.Attributes {
  model: stream.Stream<IGridModel>
  downloadCsv?: () => string;
}

export const grid: m.FactoryComponent<IGridAttrs> = () => {
  let vms: stream.Stream<IGridViewModel>;

  return {
    oninit: vn => vms = gridViewModelStream(vn.attrs.model),
    view: vn => table(vms(), vn.attrs),
  }
}

function table(vm: IGridViewModel, attrs: IGridAttrs) {
  return vm && vm.columns && vm.vrows
    ? m('table.grid', attrs,
      thead(vm),
      tbody(vm))
    : null;
}

function thead(vm: IGridViewModel) {
  const columns = vm.columns;
  return m('thead', m('tr', columns.map(column => th(vm, column))));
}

function th(vm: IGridViewModel, column: IGridColumn, ) {
  let names = undefined as string;

  if (column.sortAllow) {
    const classes = ['grid-sort-indicator'];
    if (!column.sortDirection) classes.push('grid-sort-indicator-hi');
    if (column.sortDirection > 0) classes.push('grid-sort-indicator-up');
    if (column.sortDirection < 0) classes.push('grid-sort-indicator-dn');
    names = classes.join(' ');
  }
  
  return m('th',
    {
      className: names,
      title: column.tooltip,
      onclick: column.sortAllow ? () => vm.updateSort(column.id) : undefined
    },
    column.name);
}

function tbody(vm: IGridViewModel) {
  return m('tbody',
    vm.vrows.map(vr =>
      m('tr',
        { key: vr.key },
        vm.columns.map(column => td(vr.data.get(column.id))))
    ));
}

function td(cell: IGridViewCell, ) {
  return m('td',
    {
      className: cell.cellClass,
      title: cell.tooltip,
      onclick: cell.clickHandler
    },
    cell.value);
}
