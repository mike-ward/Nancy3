﻿import { IGridModel } from "./IGridModel";
import { compareService } from '../../services/compare-service';

export function updateSortState(gm: IGridModel, columnId: string) {
  const column = gm.columns.reduce((a, c) => c.id === columnId ? c : a, null);
  if (!column.sortDirection) gm.columns.forEach(col => col.sortDirection = col.id === columnId ? 1 : 0)
  else if (column.sortDirection > 0) column.sortDirection = -1;
  else if (column.sortDirection < 0) column.sortDirection = 0;
  return gm;
}

export function sortByColumns(gm: IGridModel) {
  const sortByStates = gm.columns
    .filter(col => col.allowSort)
    .filter(col => col.sortDirection !== 0);
    // future: orderby for sort level

  for (let column of sortByStates) {
    // future: add multiple column sort

    const comparer = column.comparer
      ? column.comparer
      : compareService.compareAny;

    const columnId = column.id;
    const direction = column.sortDirection;
    const data = gm.data.slice();

    data.sort((l: any, r: any) => {
      const result = comparer(l[columnId], r[columnId]);
      return direction >= 0 ? result : -result;
    });

    return data;
  }
  return gm.data;
}
