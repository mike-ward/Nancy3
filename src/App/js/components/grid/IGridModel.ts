export interface IGridModel {
  columns: IGridColumn[];
  data: IDataRow[];
  key?: string | Function;
}

export interface IDataRow {
  [columnId: string] : string | number | Date
}

export interface IGridColumn {
  id: string;
  title: string;
  headTooltip?: string;
  hide?: boolean;
  contentIfNull?: string;
  cellRenderer?: (originalValue: any, column: IGridColumn) => string;
  allowSort?: boolean;
  comparer?: (a: any, b: any) => number;
  cellClick?: (originalValue: any, renderedValue: any, column: IGridColumn) => void;
  cellTooltip?: (originalValue: any, renderedValue: any, column: IGridColumn) => string;
}
