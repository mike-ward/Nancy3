export interface IGridModel {
  columns: IGridColumn[];
  data: IDataRow[];
  key?: string | Function;
}

interface IDataRow {
  [columnId: string] : string | number | Date
}

export interface IGridColumn {
  id: string;
  title: string;
  headTooltip?: string;
  hide?: boolean;
  contentIfNull?: string;
  cellRenderer?: (value: any, column: IGridColumn, row: IDataRow) => string;
  allowSort?: boolean;
  comparer?: (a: any, b: any) => number;
  cellClick?: (value: any, column: IGridColumn, row: IDataRow) => void;
  cellTooltip?: (value: any, column: IGridColumn, row: IDataRow) => void;
}
