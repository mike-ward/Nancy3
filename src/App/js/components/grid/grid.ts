import m from 'mithril';
import { IGridOptions, IGridColumn } from './IGridOptions';
import { compareService } from '../../services/compare-service';
import { addStyleSheet } from '../../services/dom-service';

function thead(gridOptions: IGridOptions, state: any) {
  const columns = visibleColumns(gridOptions.columns);
  const thead = m('thead', [m('tr', columns.map(column => th(column, state)))]);
  return thead;
}

function th(column: IGridColumn, state: any) {
  const th = m('th.grid-column-title',
    {
      title: column.tooltip || '',
      onclick: () => titleClickActions(column, state)
    }, [
      column.title,
      sortIndicator(column, state)
    ]
  );
  return th;
}

function tbody(gridOptions: IGridOptions, state: any) {
  const data = sortByColumn(gridOptions, state);
  const columns = visibleColumns(gridOptions.columns);
  const key = gridOptions.key;
  const tbody = m('tbody', data.map(row =>
    m('tr',
      { key: key ? (key instanceof Function ? (key as Function)(row) : row[key]) : undefined },
      columns.map(column => td(row, column))))
    );
  return tbody;
}

function td(row: {}, column: IGridColumn) {
  const value = columnValue(row, column);
  const td = m('td',
    {
      'class': column.cellClick ? 'grid-click-action' : undefined,
      title: column.cellTooltip ? column.cellTooltip(value) : undefined,
      onclick: () => column.cellClick ? column.cellClick(columnValue(row, column)) : undefined
    },
    column.renderer ? column.renderer(value) : value);
  return td;
}

function columnValue(row: any, column: IGridColumn) {
  const value = row[column.id];
  return value === null || value === undefined ? column.contentIfNull : value;
}

function visibleColumns(columns: IGridColumn[]) {
  const filtered = columns.filter(c => !c.hide);
  return filtered;
}

function sortIndicator(column: IGridColumn, state: any) {
  if (!column.allowSort) return '';
  const isSorted = column.id === state.sortedColumnId;
  const sortSymbol = isSorted && !state.sortDirection ? '▼' : '▲';
  const cssClass = `grid-column-sort-indicator${isSorted ? '' : '.grid-column-sort-indicator-hidden'}`;
  const vn = m(`span.${cssClass}`, sortSymbol);
  return vn;
}

function sortByColumn(gridOptions: IGridOptions, state: any) {
  const data = gridOptions.data.slice();
  if (!state.sortedColumnId) return data;
  const columnId = state.sortedColumnId;
  const column = gridOptions.columns[columnId];

  const comparer = column && column.comparer
    ? column.comparer
    : compareService.compareAny;

  data.sort((l: any, r: any) => {
    const result = comparer(l[columnId], r[columnId]);
    return state.sortDirection ? result : -result;
  });

  return data;
}

function titleClickActions(column: IGridColumn, state: any) {
  if (column.allowSort) columnSortAction(column, state);
}

function columnSortAction(column: IGridColumn, state: any) {
  state.sortDirection = state.sortedColumnId === column.id
    ? !state.sortDirection
    : true;

  state.sortedColumnId = state.sortedColumnId === column.id && state.sortDirection
    ? null
    : column.id;
}

function view(v) {
  const gridOptions = v.attrs.gridOptions as IGridOptions;
  if (!gridOptions || !gridOptions.columns || !gridOptions.data) return null;

  const vn = m('.grid', v.attrs, [
    m('table.pure-table.pure-table-bordered', [
      thead(gridOptions, v.state),
      tbody(gridOptions, v.state)
    ])
  ]);
  return vn;
}

// language=CSS
const css = `
  .grid th, .grid td{white-space:nowrap;}
  .grid-click-action{cursor:pointer;}
  .grid-click-action:hover{text-decoration: underline;}
  .grid-column-title:hover{cursor:pointer;}
  .grid-column-sort-indicator{margin-left:1em;}
  .grid-column-sort-indicator-hidden{visibility:collapse;}
  .grid-column-title:hover .grid-column-sort-indicator-hidden{color:gray !important;visibility:visible;}`;

addStyleSheet(css);

export const grid = {
  view: view
}
