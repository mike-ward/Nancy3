import m from 'mithril';
import stream from 'mithril/stream';
import constants from '../../services/constants-service';
import { cssStylesAdd } from '../../services/css-service';
import { gridViewModelStream } from './grid-view-model';
import { IGridAttrs, IGridColumn, IGridViewModel, IGridViewCell } from './grid-interfaces';

export const gridStyles =
  `div.app-grid { overflow-x: auto }
   table.app-grid {border:1px;border-collapse:collapse}
  .app-grid th {background-color:${constants.color.thBg};color:${constants.color.text}!important}
  .app-grid th,.app-grid td {white-space:nowrap;padding:.2em;text-align:left;border:1px solid #eee}
  .app-grid-cell-click-action {cursor:pointer;}
  .app-grid-cell-click:hover {text-decoration:underline;}
  .app-grid-sort-indicator:hover, .app-grid-sort-indicator-up, .app-grid-sort-indicator-dn {cursor:pointer;}
  .app-grid-sort-indicator-hi:after {content:'▲';color:#ccd;visibility:hidden;}
  .app-grid-sort-indicator-hi:hover:after {visibility:visible}
  .app-grid-sort-indicator-up:after {content:'▲'}
  .app-grid-sort-indicator-dn:after {content:'▼'}`;

cssStylesAdd(gridStyles);

export const grid: m.FactoryComponent<IGridAttrs> = () => {
  let vms: stream.Stream<IGridViewModel>;

  return {
    oninit: vn => vms = gridViewModelStream(vn.attrs.model),
    view: vn => table(vms(), vn.attrs),
  }
}

function table(vm: IGridViewModel, attrs: IGridAttrs) {
  return vm && vm.columns && vm.vrows
    ? m('.app-grid',
      m('table.app-grid', attrs, [thead(vm), tbody(vm)]))
    : null;
}

function thead(vm: IGridViewModel) {
  const columns = vm.columns;
  return m('thead',
    m('tr', columns.map(column => th(vm, column))));
}

function th(vm: IGridViewModel, column: IGridColumn, ) {
  let names = undefined as string;

  if (column.sortEnable) {
    const classes = ['app-grid-sort-indicator'];
    if (!column.sortDirection) classes.push('app-grid-sort-indicator-hi');
    if (column.sortDirection > 0) classes.push('app-grid-sort-indicator-up');
    if (column.sortDirection < 0) classes.push('app-grid-sort-indicator-dn');
    names = classes.join(' ');
  }

  return m('th',
    {
      className: names,
      title: column.tooltip,
      onclick: column.sortEnable ? () => vm.updateSort(column.id) : undefined
    },
    column.name);
}

function tbody(vm: IGridViewModel) {
  return m('tbody',
    vm.vrows.map(vr =>
      m('tr',
        { key: vr.key },
        vm.columns.map(column => td(vr.data.get(column.id), column.css)))
    ));
}

function td(cell: IGridViewCell, css: string | object) {
  return m('td',
    {
      style: css,
      title: cell.tooltip,
      onclick: cell.clickHandler,
      className: cell.clickHandler ? 'app-grid-cell-click' : undefined
    },
    cell.value);
}