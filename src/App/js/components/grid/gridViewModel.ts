import stream from 'mithril/stream';
import { IGridModel } from './IGridModel';
import { sortByColumns, updateSortState, sortedBy } from './gridSort';

export interface ISortByColumn {
  id: string;
  direction: number;
}

export interface ISortByMap {
  [id: string]: { direction: number, ordinal: number }
}

export interface IGridViewModel extends IGridModel {
  sortedBy: ISortByMap;
  updateSort: (columnId: string) => void;
}

export function gridViewModelStream(gridModelStream: stream.Stream<IGridModel>) {
  let sortByState = [] as ISortByColumn[];

  const gridViewModelStream = gridModelStream.map<IGridViewModel>(gm => gm &&
    ({
      columns: gm.columns.filter(c => !c.hide),
      data: sortByColumns(gm, sortByState),
      key: gm.key,
      sortedBy: sortedBy(sortByState),
      updateSort: (columnId: string) => {
        sortByState = updateSortState(columnId, sortByState);
        gridModelStream(gm);
      }
    }));

  return gridViewModelStream;
}
