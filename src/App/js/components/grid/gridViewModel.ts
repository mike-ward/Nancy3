import stream from 'mithril/stream';
import { IGridModel, IGridColumn, IGridDataRow } from './IGridModel';
import { sortByColumns, updateSortState, ISortByColumn } from './gridSort';

export interface IGridViewModel {
  columns: IGridViewColumn[];
  data: IGridViewDataRow[];
  updateSort: (columnId: string) => void;
}

export interface IGridViewColumn extends IGridColumn {
  direction: number;
  sortLevel: number;
}

export interface IGridViewDataRow {
  key: string;
  row: { [columnId: string]: IGridViewDataCell };
}

export interface IGridViewDataCell {
  value: any;
  cellClass: string;
  tooltip: string;
  clickHandler: (event: Event) => void;
}

export function gridViewModelStream(gridModelStream: stream.Stream<IGridModel>) {
  let sortByState = [] as ISortByColumn[];

  const viewModelStream = gridModelStream.map<IGridViewModel>(gm => gm &&
    ({
      columns: gridViewColumns(gm.columns.filter(c => !c.hide), sortByState),
      data: gridViewDataRows(gm, sortByColumns(gm, sortByState)),
      updateSort: (columnId: string) => {
        sortByState = updateSortState(columnId, sortByState);
        gridModelStream(gm);
      }
    }));

  return viewModelStream;
}

function gridViewColumns(columns: IGridColumn[], sortByState: ISortByColumn[]) {
  return columns.map<IGridViewColumn>(column => {
    const states = sortByState.filter(state => state.id === column.id);
    const direction = states.length ? states[0].direction : 0;

    return {
      ...column,
      direction: direction,
      sortLevel: 0
    };
  });
}

function gridViewDataRows(gm: IGridModel, dataRows: IGridDataRow[]) {
  return dataRows.map(dataRow => gridDataRow(gm, dataRow));
}

function gridDataRow(gm: IGridModel, dataRow: IGridDataRow) {
  const dr = gm.columns.reduce((a, col) => {
    const val = dataRow[col.id];
    const value = val === null || val === undefined
      ? col.contentIfNull
      : val;
    const renderedValue = col.cellRenderer
      ? col.cellRenderer(value, col, dataRow, gm.meta)
      : value;
    const cellClass = col.cellClick
      ? 'grid-cell-click'
      : undefined;
    const tooltip = col.cellTooltip
      ? col.cellTooltip(value, renderedValue, col, dataRow, gm.meta)
      : undefined;
    const clickHandler = (event: Event) => col.cellClick
      ? col.cellClick(event, value, renderedValue, col, dataRow, gm.meta)
      : undefined;

    a.row[col.id] = {
      value: renderedValue,
      cellClass: cellClass,
      tooltip: tooltip,
      clickHandler: clickHandler
    }

    return a;
  }, { key: null, row: Object.create(null) } as IGridViewDataRow);

  dr.key = gm.key ? dr.row[gm.key].value : undefined;
  return dr;
}
