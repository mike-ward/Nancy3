import m from 'mithril';
import { IGridOptions, IGridColumn } from './IGridOptions';
import { compareService } from '../../services/compare-service';
import { cssStylesAdd } from '../../services/css-service';

// language=CSS
cssStylesAdd(`
  .grid th,.grid td{white-space:nowrap;}
  .grid-cell-click-action{cursor:pointer;}
  .grid-cell-click:hover{text-decoration:underline;}
  .grid-sort-title:hover,.grid-sort-indicator-up,.grid-sort-indicator-dn{cursor:pointer;}
  .grid-sort-indicator-up:after{content:'▲'}
  .grid-sort-indicator-dn:after{content:'▼'}
`);

export const grid = {
  view: view
}

function view(v: m.Vnode) {
  const gridOptions = (v.attrs as any).gridOptions as IGridOptions;
  if (!gridOptions || !gridOptions.columns || !gridOptions.data) return null;

  const vn = m('.grid', v.attrs,
    m('table.pure-table.pure-table-bordered',
      thead(gridOptions),
      tbody(gridOptions)
    )
  );
  return vn;
}

function thead(gridOptions: IGridOptions) {
  const columns = visibleColumns(gridOptions.columns);
  const thead = m('thead', m('tr', columns.map(column => th(column, gridOptions))));
  return thead;
}

function th(column: IGridColumn, gridOptions: IGridOptions) {
  const classes = column.allowSort ? ['grid-sort-title'] : [];

  const sortByColumn =
    gridOptions.sortBy &&
    gridOptions.sortBy.reduce((a, c) => c.id === column.id ? c : a, null);

  if (sortByColumn) {
    const sortByClass = sortByColumn.direction === 'up'
      ? 'grid-sort-indicator-up'
      : 'grid-sort-indicator-dn';
    classes.push(sortByClass);
  }

  const th = m('th',
    {
      'class': classes.join(' '),
      title: column.headTooltip || undefined,
      onclick: () => titleClickActions(column, gridOptions)
    },
    column.title
  );
  return th;
}

function tbody(gridOptions: IGridOptions) {
  const data = sortByColumns(gridOptions);
  const columns = visibleColumns(gridOptions.columns);
  const key = gridOptions.key;

  const getKey = key
    ? (key instanceof Function)
      ? (row: any) => (key as Function)(row)
      : (row: any) => row[key]
    : (): undefined => undefined;

  const tbody = m('tbody', data.map(row =>
    m('tr',
      { key: getKey(row) },
      columns.map(column => td(row, column))))
  );

  return tbody;
}

function td(row: { [idx: string]: any }, column: IGridColumn) {
  const val = row[column.id];
  const value: any = val === null || val === undefined ? column.contentIfNull : val;
  const renderedValue = column.cellRenderer ? column.cellRenderer(value, column, row) : value;
  const className = column.cellClick ? 'grid-cell-click' : undefined;
  const tooltip = column.cellTooltip ? column.cellTooltip(value, column, row) : undefined;
  const clickHandler = () => column.cellClick ? column.cellClick(value, column, row) : undefined;

  const td = m('td',
    {
      'class': className,
      title: tooltip,
      onclick: clickHandler
    },
    renderedValue);

  return td;
}

function visibleColumns(columns: IGridColumn[]) {
  const filtered = columns.filter(c => !c.hide);
  return filtered;
}

function sortByColumns(gridOptions: IGridOptions) {
  if (gridOptions.sortBy) {
    for (let sortByColumn of gridOptions.sortBy) {
      // future: add multiple column sort
      const column = gridOptions.columns.reduce((a, c) => c.id === sortByColumn.id ? c : a, null);
      if (!column) return gridOptions.data;

      const comparer = column.comparer
        ? column.comparer
        : compareService.compareAny;

      const columnId = column.id;
      const data = gridOptions.data.slice();

      data.sort((l: any, r: any) => {
        const result = comparer(l[columnId], r[columnId]);
        return sortByColumn.direction === 'up' ? result : -result;
      });

      return data;
    }
  }
  return gridOptions.data;
}

function titleClickActions(column: IGridColumn, gridOptions: IGridOptions) {
  if (column.allowSort) columnSortAction(column.id, gridOptions);
}

function columnSortAction(columnId: string, gridOptions: IGridOptions) {
  if (!gridOptions.sortBy) gridOptions.sortBy = [];
  let sortByColumn = gridOptions.sortBy.reduce((a, c) => c.id === columnId ? c : a, null);

  if (!sortByColumn) {
    sortByColumn = { id: columnId, direction: 'up' }
    gridOptions.sortBy = [sortByColumn];
    return;
  }

  if (sortByColumn.direction === 'up') sortByColumn.direction = 'dn';
  else if (sortByColumn.direction === 'dn') gridOptions.sortBy = null;
}
