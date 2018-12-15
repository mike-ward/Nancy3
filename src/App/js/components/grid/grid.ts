import m from 'mithril';
import stream from 'mithril/stream';
import { IGridAttrs, IGridColumn } from './grid-model-interfaces';
import { gridViewModelStream, IGridViewModel, IGridViewCell } from './grid-view-model';
import { cssStylesAdd } from '../../services/css-service';
import { exportCsv } from './grid-export-csv';

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

/**Creates an HTML table with data from the given model.
 * Optional features such as sorting, filtering and custom
 * rendering are controlled by the individual column models
 *
 * Exported formats like csv and excel can be retrieved by
 * giving the grid additional attribute streams. The streams
 * are updated when the model is updated. The csv and excel
 * streams should be treated as readonly
 *
 * Updating the model does not trigger a redraw
 *
 * The grid is performant. It guarantees that the view model
 * is calculated only once per model update. Rendering the
 * view reads the view model but does not modify it.
 * */
export const grid: m.FactoryComponent<IGridAttrs> = () => {
  let vms: stream.Stream<IGridViewModel>;

  return {
    oninit: vn => {
      vms = gridViewModelStream(vn.attrs.model);
      if (vn.attrs.csv) vms.map(vm => vn.attrs.csv(exportCsv(vm)));
    },
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
  return m('thead',
    m('tr', columns.map(column => th(vm, column))));
}

function th(vm: IGridViewModel, column: IGridColumn, ) {
  let names = undefined as string;

  if (column.sortEnable) {
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
      className: cell.cellClass,
      onclick: cell.clickHandler
    },
    cell.value);
}