import m from 'mithril';
import stream from 'mithril/stream';
import { IGridModel, IGridColumn, IGridRow } from './grid-model-interfaces';
import { sortByColumns, updateSortState } from './grid-sort';

export interface IGridViewModel {
  columns: IGridColumn[];
  vrows: IGridViewRow[];
  updateSort: (columnId: string) => void;
}

export interface IGridViewRow {
  key: string;
  data: Map<string, IGridViewCell>;
}

export interface IGridViewCell {
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

function gridDataRow(gm: IGridModel, dataRow: IGridRow) {
  const dr = gm.columns.reduce((a, col) => {
    const value = dataRow[col.id];
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

    const column = {
      value: renderedValue,
      cellClass: cellClass,
      tooltip: tooltip,
      clickHandler: clickHandler
    };

    a.data.set(col.id, column);
    return a;
  }, { key: null, data: new Map<string, IGridViewCell>() });

  dr.key = gm.key ? dr.data.get(gm.key).value : undefined;
  return dr;
}