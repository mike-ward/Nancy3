import m from 'mithril';
import { IGridModel, IGridColumn } from './IGridModel';
import { gridViewModel } from './gridViewModel';
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

export const grid: m.FactoryComponent<IGridAttrs> = () => {
  const vm = gridViewModel();

  return {
    view: v => {
      const model = vm.viewModel(v.attrs.model);
      if (!model) return null;

      return m('.grid', v.attrs,
        m('table.pure-table.pure-table-bordered',
          thead(model),
          tbody(model)
        )
      );
    }
  }

  function thead(model: IGridModel) {
    const columns = model.columns;
    const vnode = m('thead', m('tr', columns.map(column => th(column))));
    return vnode;
  }

  function th(column: IGridColumn) {
    const classes = [] as string[];
    if (column.allowSort) {
      classes.push('grid-sort-title');
      const direction = vm.sortByDirection(column.id);
      if (direction > 0) classes.push('grid-sort-indicator-up');
      if (direction < 0) classes.push('grid-sort-indicator-dn');
    }
    return m('th',
      {
        className: classes.join(' '),
        title: column.headTooltip || undefined,
        onclick: column.allowSort ? () => vm.updateSortState(column.id) : undefined
      },
      column.title
    );
  }

  function tbody(model: IGridModel) {
    const data = model.data;
    const columns = model.columns;
    const key = model.key;

    const getKey = key
      ? (key instanceof Function)
        ? (row: any) => (key as Function)(row)
        : (row: any) => row[key]
      : (): undefined => undefined;

    return m('tbody',
      data.map(row =>
        m('tr',
          { key: getKey(row) },
          columns.map(column => td(row, column))))
    );
  }

  function td(row: { [idx: string]: any }, column: IGridColumn) {
    const val = row[column.id];
    const value: any = val === null || val === undefined ? column.contentIfNull : val;
    const renderedValue = column.cellRenderer ? column.cellRenderer(value, column, row) : value;
    const className = column.cellClick ? 'grid-cell-click' : undefined;
    const tooltip = column.cellTooltip ? column.cellTooltip(value, column, row) : undefined;
    const clickHandler = () => column.cellClick ? column.cellClick(value, column, row) : undefined;

    return m('td',
      {
        className: className,
        title: tooltip,
        onclick: clickHandler
      },
      renderedValue);
  }
}