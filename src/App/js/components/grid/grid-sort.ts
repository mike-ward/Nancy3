﻿import { IGridModel, IGridRow } from "./grid-interfaces";
import { compareService } from '../../services/compare-service';

type comparerType = (a: any, b: any) => number;

export function updateSortState(gm: IGridModel, columnId: string) {
  const column = gm.columns.reduce((a, c) => c.id === columnId ? c : a, null);
  if (!column.sortDirection) gm.columns.forEach(col => col.sortDirection = col.id === columnId ? 1 : 0)
  else if (column.sortDirection > 0) column.sortDirection = -1;
  else if (column.sortDirection < 0) column.sortDirection = 0;
  return gm;
}

export function sortByColumns(gm: IGridModel) {
  const sortByStates = gm.columns
    .filter(col => col.sortEnable)
    .filter(col => col.sortDirection);
  // future: orderby for sort level

  for (let column of sortByStates) {
    // future: add multiple column sort
    const comparer: comparerType =
      column.sortComparer
        ? column.sortComparer
        : compareService.naturalStringCompare;

    const columnId = column.id;
    const sortDirection = column.sortDirection;
    const data = gm.data.slice();

    data.sort((a: IGridRow, b: IGridRow) => {
      const result = comparer(a[columnId], b[columnId]);
      return sortDirection >= 0 ? result : -result;
    });

    return data;
  }
  return gm.data;
}