import stream from 'mithril/stream';
import { IGridModel, IGridColumn } from './IGridModel';
import { compareService } from '../../services/compare-service';

interface ISortByColumn {
  id: string;
  direction: number;
}

interface ISortByMap {
  [id: string]: { direction: number, ordinal: number }
}

export interface IGridViewModel extends IGridModel {
  sortedBy: ISortByMap;
  updateSort: (columnId: string) => void;
}

export function gridViewModel(gridModel: stream.Stream<IGridModel>) {
  let sortByState = [] as ISortByColumn[];
  const gridModels = stream.scan((_, gm) => updateGridModel(gm), gridModel(), gridModel);
  return gridModels.map<IGridViewModel>(model => updateGridViewModel(model));

  function updateGridViewModel(gridModel: IGridModel) {
    return {
      ...gridModel,
      sortedBy: sortedBy(),
      updateSort: updateSortState
    }
  }

  function updateGridModel(gridModel: IGridModel) {
    if (!gridModel || !gridModel.columns || !gridModel.data) return null;
    const columns = visibleColumns(gridModel.columns);
    const data = sortByColumns(gridModel);

    const gm = {
      columns: columns,
      data: data,
      key: gridModel.key
    } as IGridModel;

    return gm;
  }

  function visibleColumns(columns: IGridColumn[]) {
    const filtered = columns.filter(c => !c.hide);
    return filtered;
  }

  function sortedBy() {
    const map = sortByState.reduce<ISortByMap>(
      (a, c, i) => {
        a[c.id] = { direction: c.direction, ordinal: i };
        return a;
      }, {});
    return map;
  }

  function updateSortState(columnId: string) {
    const sortBy = sortByState.reduce((a, c) => c.id === columnId ? c : a, null);
    if (!sortBy) sortByState = [{ id: columnId, direction: 1 }];
    else if (sortBy.direction > 0) sortBy.direction = -1;
    else if (sortBy.direction < 0) sortByState = [];
    gridModel(gridModel());
  }

  function sortByColumns(model: IGridModel) {
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
}