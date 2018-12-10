import m from 'mithril';
import stream from 'mithril/stream';
import { IGridModel, IGridColumn, IGridDataRow } from './IGridModel';
import { sortByColumns, updateSortState } from './gridSort';

export interface IGridViewModel {
  columns: IGridColumn[];
  vrows: IGridViewDataRow[];
  updateSort: (columnId: string) => void;
}

export interface IGridViewDataRow {
  key: string;
  data: { [columnId: string]: IGridViewDataCell };
}

export interface IGridViewDataCell {
  value: any;
  cellClass: string;
  tooltip: string;
  clickHandler: (event: Event) => void;
}

export function gridViewModelStream(gms: stream.Stream<IGridModel>) {
  const viewModelStream = gms.map<IGridViewModel>(gm => gm &&
    ({
      columns: gm.columns.filter(c => !c.hide),
      vrows: gridViewDataRows(gm),
      updateSort: (columnId: string) => gms(updateSortState(gm, columnId))
    }));
  return viewModelStream;
}

function gridViewDataRows(gm: IGridModel) {
  const dataRows = sortByColumns(gm);
  return dataRows.map(dataRow => gridDataRow(gm, dataRow));
}

function gridDataRow(gm: IGridModel, dataRow: IGridDataRow) {
  const dr = gm.columns.reduce((a, col) => {
    const val = dataRow[col.id];
    const value = val === null || val === undefined
      ? col.contentIfNull
      : val;
    const renderedValue = col.cellRenderer
      ? m.trust(col.cellRenderer(value, col, dataRow, gm.meta))
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

    a.data[col.id] = {
      value: renderedValue,
      cellClass: cellClass,
      tooltip: tooltip,
      clickHandler: clickHandler
    }

    return a;
  }, { key: null, data: Object.create(null) } as IGridViewDataRow);

  dr.key = gm.key ? dr.data[gm.key].value : undefined;
  return dr;
}
