import stream from 'mithril/stream';
import { IGridModel, IGridColumn, IGridDataRow } from './IGridModel';
import { sortByColumns, updateSortState, sortedBy } from './gridSort';

export interface ISortByColumn {
  id: string;
  direction: number; // -1, 1
}

export interface ISortByMap {
  [id: string]: { direction: number, ordinal: number }
}

export interface IGridViewDataCell {
  value: any;
  cellClass: string;
  tooltip: string;
  clickHandler: (event: Event) => void;
}

export interface IGridViewDataRow {
  [columnId: string]: IGridViewDataCell
}

export interface IGridViewModel {
  columns: IGridColumn[];
  data: IGridViewDataRow[];
  key: string;
  sortedBy: ISortByMap;
  updateSort: (columnId: string) => void;
}

export function gridViewModelStream(gridModelStream: stream.Stream<IGridModel>) {
  let sortByState = [] as ISortByColumn[];

  const gridViewModelStream = gridModelStream.map<IGridViewModel>(gm => gm &&
    ({
      columns: gm.columns.filter(c => !c.hide),
      data: gridViewDataRows(gm, sortByColumns(gm, sortByState)),
      key: gm.key,
      sortedBy: sortedBy(sortByState),
      updateSort: (columnId: string) => {
        sortByState = updateSortState(columnId, sortByState);
        gridModelStream(gm);
      }
    }));

  return gridViewModelStream;
}

function gridViewDataRows(gm: IGridModel, dataRows: IGridDataRow[]) {
  const columns = gm.columns;

  const data = dataRows.map(
    dataRow => columns.reduce((a, col) => {
      const val = dataRow[col.id];
      const value = val === null || val === undefined ? col.contentIfNull : val;
      const renderedValue = col.cellRenderer ? col.cellRenderer(value, col, dataRow, gm.meta) : value;
      const cellClass = col.cellClick ? 'grid-cell-click' : undefined;
      const tooltip = col.cellTooltip ? col.cellTooltip(value, renderedValue, col, dataRow, gm.meta) : undefined;
      const clickHandler = (event: Event) => col.cellClick ? col.cellClick(event, value, renderedValue, col, dataRow, gm.meta) : undefined;

      const cell = {
        value: renderedValue,
        cellClass: cellClass,
        tooltip: tooltip,
        clickHandler: clickHandler
      }

      a[col.id] = cell;
      return a;
    }, Object.create(null) as IGridViewDataRow));

  return data;
}