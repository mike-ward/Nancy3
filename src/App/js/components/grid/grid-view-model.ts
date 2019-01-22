import stream from 'mithril/stream';
import { sortRowsByColumns, updateSortState } from './grid-sort';
import { IGridModel, IGridViewModel, IGridRow, IGridColumn, IGridViewRow, IGridViewCell } from './grid-interfaces';

export function gridViewModel(model: stream.Stream<IGridModel>) {
  const vms = model.map<IGridViewModel>(mdl => mdl &&
    ({
      columns: mdl.columns.filter(c => !c.hide),
      vrows: gridViewDataRows(mdl),
      updateSort: (columnId: string) => model(updateSortState(mdl, columnId))
    }));

  return vms;
}

function gridViewDataRows(gm: IGridModel) {
  const rows = gm.rows.map(row => gridDataRow(gm, row));
  sortRowsByColumns(gm.columns, rows);
  return rows;
}

function gridDataRow(gm: IGridModel, dataRow: IGridRow) {
  const data = gm.columns.reduce(
    (a, col) => a.set(col.id, gridDataCell(dataRow, col, gm)),
    new Map<string, IGridViewCell>());

  const row = { data: data } as IGridViewRow;

  // Only create key if value defined to reduce memory footprint
  if (gm.key) row.key = dataRow[gm.key]

  return row;
}

function gridDataCell(row: IGridRow, col: IGridColumn, gm: IGridModel) {
  const value = row[col.id];

  const renderedValue = col.cellRenderer
    ? col.cellRenderer(value, col, row, gm.meta)
    : value;

  const tooltip = col.cellTooltip
    ? col.cellTooltip(value, renderedValue, col, row, gm.meta)
    : undefined;

  const clickHandler = (event: KeyboardEvent) => col.cellClick
    ? col.cellClick(event, value, renderedValue, col, row, gm.meta)
    : undefined;

  const cell = { value: renderedValue } as IGridViewCell;

  // Only create keys if values defined to reduce memory footprint
  if (tooltip) cell.tooltip = tooltip;
  if (clickHandler) cell.clickHandler = clickHandler;

  return cell;
}