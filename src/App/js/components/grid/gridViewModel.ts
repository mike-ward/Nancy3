import stream from 'mithril/stream';
import { IGridModel, IGridColumn } from './IGridModel';
import { compareService } from '../../services/compare-service';

interface ISortByColumn {
  id: string;
  direction: number;
}

export interface IGridViewModel {
  model: stream.Stream<stream.Stream<IGridModel>>;
  sortByDirection: (columnId: string) => number;
  updateSortState: (columnId: string) => void;
}

export function gridViewModel(model: stream.Stream<IGridModel>) {
  const update = stream() as stream.Stream<IGridModel>;
  const models = stream.scan((a, v) => stream(viewModel(v)), model, update);
  let sortByState = [] as ISortByColumn[];

  return {
    model: models,
    sortByDirection: sortByDirection,
    updateSortState: updateSortState
  } as IGridViewModel;

  function viewModel(model: IGridModel) {
    if (!model || !model.columns || !model.data) return null;
    const columns = visibleColumns(model.columns);
    const data = sortByColumns(model);

    const nm = {
      columns: columns,
      data: data,
      key: model.key
    } as IGridModel;

    return nm;
  }

  function sortByDirection(columnId: string) {
    const sortByColumn = sortByState.reduce((a, c) => c.id === columnId ? c : a, null);
    return sortByColumn ? sortByColumn.direction : 0;
  }

  function updateSortState(columnId: string) {
    const sortBy = sortByState.reduce((a, c) => c.id === columnId ? c : a, null);
    if (!sortBy) sortByState = [{ id: columnId, direction: 1 }];
    else if (sortBy.direction > 0) sortBy.direction = -1;
    else if (sortBy.direction < 0) sortByState = [];
    update(model());
  }

  function visibleColumns(columns: IGridColumn[]) {
    const filtered = columns.filter(c => !c.hide);
    return filtered;
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
      const data = model.data.slice();

      data.sort((l: any, r: any) => {
        const result = comparer(l[columnId], r[columnId]);
        return sortByColumn.direction >= 0 ? result : -result;
      });

      return data;
    }
    return model.data;
  }
}