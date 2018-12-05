import m from 'mithril';
import { IGridModel, IGridColumn } from './IGridModel';
import { compareService } from '../../services/compare-service';
import { cssStylesAdd } from '../../services/css-service';

// language=CSS
cssStylesAdd(`
  .grid th, .grid td{white-space:nowrap;}
  .grid-cell-click-action{cursor:pointer;}
  .grid-cell-click:hover{text-decoration:underline;}
  .grid-sort-title:hover, .grid-sort-indicator-up, .grid-sort-indicator-dn{cursor:pointer;}
  .grid-sort-indicator-up:after{content:'▲'}
  .grid-sort-indicator-dn:after{content:'▼'}
`);

export interface IGridAttrs extends m.Attributes {
  model: IGridModel
}

interface ISortByColumn {
  id: string;
  direction: 'up' | 'dn';
}

export const grid: m.FactoryComponent<IGridAttrs> = () => {
  // Save sortBy column states here.
  let sortBy: ISortByColumn[] = null;

  return {
    view: v => {
      const model = v.attrs.model;
      if (!model || !model.columns || !model.data) return null;

      const vn = m('.grid',
        v.attrs,
        m('table.pure-table.pure-table-bordered',
          thead(model),
          tbody(model)
        )
      );
      return vn;
    }
  }

  function thead(model: IGridModel) {
    const columns = visibleColumns(model.columns);
    const thead = m('thead', m('tr', columns.map(column => th(column))));
    return thead;
  }

  function th(column: IGridColumn) {
    const classes = column.allowSort ? ['grid-sort-title'] : [];

    const sortByColumn =
      sortBy &&
      sortBy.reduce((a, c) => c.id === column.id ? c : a, null);

    if (sortByColumn) {
      const sortByClass = sortByColumn.direction === 'up'
        ? 'grid-sort-indicator-up'
        : 'grid-sort-indicator-dn';
      classes.push(sortByClass);
    }

    const th = m('th',
      {
        className: classes.join(' '),
        title: column.headTooltip || undefined,
        onclick: () => titleClickActions(column)
      },
      column.title
    );
    return th;
  }

  function tbody(model: IGridModel) {
    const data = sortByColumns(model);
    const columns = visibleColumns(model.columns);
    const key = model.key;

    const getKey = key
      ? (key instanceof Function)
        ? (row: any) => (key as Function)(row)
        : (row: any) => row[key]
      : (): undefined => undefined;

    const tbody = m('tbody',
      data.map(row =>
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
        className: className,
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

  function sortByColumns(model: IGridModel) {
    if (sortBy) {
      for (let sortByColumn of sortBy) {
        // future: add multiple column sort
        const column = model.columns.reduce((a, c) => c.id === sortByColumn.id ? c : a, null);
        if (!column) return model.data;

        const comparer = column.comparer
          ? column.comparer
          : compareService.compareAny;

        const columnId = column.id;
        const data = model.data.slice();

        data.sort((l: any, r: any) => {
          const result = comparer(l[columnId], r[columnId]);
          return sortByColumn.direction === 'up' ? result : -result;
        });

        return data;
      }
    }
    return model.data;
  }

  function titleClickActions(column: IGridColumn) {
    if (column.allowSort) columnSortAction(column.id);
  }

  function columnSortAction(columnId: string) {
    if (!sortBy) sortBy = [];
    let sortByColumn = sortBy.reduce((a, c) => c.id === columnId ? c : a, null);

    if (!sortByColumn) {
      sortByColumn = { id: columnId, direction: 'up' };
      sortBy = [sortByColumn];
      return;
    }

    if (sortByColumn.direction === 'up') sortByColumn.direction = 'dn';
    else if (sortByColumn.direction === 'dn') sortBy = null;
  }
}