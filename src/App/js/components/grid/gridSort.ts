import { IGridModel } from "./IGridModel";
import { compareService } from '../../services/compare-service';

export interface ISortByColumn {
  id: string;
  direction: number; // -1, 1
}

export function updateSortState(columnId: string, sortByState: ISortByColumn[]) {
  const sortBy = sortByState.reduce((a, c) => c.id === columnId ? c : a, null);
  if (!sortBy) sortByState = [{ id: columnId, direction: 1 }];
  else if (sortBy.direction > 0) sortBy.direction = -1;
  else if (sortBy.direction < 0) sortByState = [];
  return sortByState;
}

export function sortByColumns(model: IGridModel, sortByState: ISortByColumn[]) {
  for (let sortByColumn of sortByState) {
    // future: add multiple column sort
    const column = model.columns.reduce((a, c) => c.id === sortByColumn.id ? c : a, null);
    if (!column) return model.data;

    const comparer = column.comparer
      ? column.comparer
      : compareService.compareAny;

    const columnId = column.id;
    const direction = sortByColumn.direction;
    const data = model.data.slice();

    data.sort((l: any, r: any) => {
      const result = comparer(l[columnId], r[columnId]);
      return direction >= 0 ? result : -result;
    });

    return data;
  }
  return model.data;
}
