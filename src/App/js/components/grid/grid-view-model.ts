import stream from 'mithril/stream';
import { sortByColumns, updateSortState } from './grid-sort';
import { IGridModel, IGridViewModel, IGridRow, IGridColumn, IGridViewCell } from './grid-interfaces';

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
  const rows = dataRows.map(dataRow => gridDataRow(gm, dataRow));
  return rows;
}

function gridDataRow(gm: IGridModel, dataRow: IGridRow) {
  const data = gm.columns.reduce(
    (a, col) => a.set(col.id, gridDataCell(dataRow, col, gm)),
    new Map<string, IGridViewCell>());

  const row = {
    key: gm.key ? dataRow[gm.key] : undefined,
    data: data
  }

  return row;
}

function gridDataCell(dataRow: IGridRow, col: IGridColumn, gm: IGridModel) {
  const value = dataRow[col.id];

  const renderedValue = col.cellRenderer
    ? col.cellRenderer(value, col, dataRow, gm.meta)
    : value;

  const tooltip = col.cellTooltip
    ? col.cellTooltip(value, renderedValue, col, dataRow, gm.meta)
    : undefined;

  const clickHandler = (event: Event) => col.cellClick
    ? col.cellClick(event, value, renderedValue, col, dataRow, gm.meta)
    : undefined;

  const cell = {
    value: renderedValue,
    tooltip: tooltip,
    clickHandler: clickHandler
  };

  return cell;
}