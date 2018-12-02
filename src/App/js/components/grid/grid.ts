﻿import m from 'mithril';
import { IGridOptions, IGridColumn } from './IGridOptions';
import { compareService } from '../../services/compare-service';
import { cssStylesAdd } from '../../services/css-service';

// language=CSS
cssStylesAdd(`
  .grid th, .grid td{white-space:nowrap;}
  .grid-click-action{cursor:pointer;}
  .grid-click-action:hover{text-decoration: underline;}
  .grid-column-title:hover{cursor:pointer;}
  .grid-column-sort-indicator{margin-left:1em;}
  .grid-column-sort-indicator-hidden{visibility:collapse;}
  .grid-column-title:hover .grid-column-sort-indicator-hidden{color:gray !important;visibility:visible;}`);

export const grid = {
  view: view
}

function thead(gridOptions: IGridOptions, state: any) {
  const columns = visibleColumns(gridOptions.columns);
  const thead = m('thead', m('tr', columns.map(column => th(column, state))));
  return thead;
}

function th(column: IGridColumn, state: any) {
  const th = m('th',
    {
      'class': column.allowSort ? 'grid-column-title' : '',
      title: column.headTooltip || undefined,
      onclick: () => titleClickActions(column, state)
    },
    column.title,
    sortIndicator(column, state)
  );
  return th;
}

function tbody(gridOptions: IGridOptions, state: any) {
  const data = sortByColumn(gridOptions, state);
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
      columns.map(column => td(row, column, state))))
  );

  return tbody;
}

function td(row: { [idx: string]: any }, column: IGridColumn, state: any) {
  const val = row[column.id];
  const value: any = val === null || val === undefined ? column.contentIfNull : val;
  const renderedValue = column.cellRenderer ? column.cellRenderer(value, column, state) : value;
  const className = column.cellClick ? 'grid-click-action' : undefined;
  const tooltip = column.cellTooltip ? column.cellTooltip(value, column, state) : undefined;
  const clickHandler = () => column.cellClick ? column.cellClick(value, column, state) : undefined;

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

function sortIndicator(column: IGridColumn, state: any) {
  if (!column.allowSort) return '';
  const isSorted = column.id === state.sortedColumnId;
  const sortSymbol = isSorted && !state.sortDirection ? '▼' : '▲';
  const cssClass = `grid-column-sort-indicator${isSorted ? '' : '.grid-column-sort-indicator-hidden'}`;
  const vn = m(`span.${cssClass}`, sortSymbol);
  return vn;
}

function sortByColumn(gridOptions: IGridOptions, state: any) {
  const columnId = state.sortedColumnId;
  if (!columnId) return gridOptions.data;
  const data = gridOptions.data.slice();
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

function view(v: m.Vnode) {
  const gridOptions = (v.attrs as any).gridOptions as IGridOptions;
  if (!gridOptions || !gridOptions.columns || !gridOptions.data) return null;

  const vn = m('.grid', v.attrs,
    m('table.pure-table.pure-table-bordered',
      thead(gridOptions, v.state),
      tbody(gridOptions, v.state)
    )
  );
  return vn;
}
