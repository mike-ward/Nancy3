export interface IGridModel {
  columns: IGridColumn[];
  data: IGridDataRow[];
  key?: string; // column id
  meta?: any;
}

export interface IGridDataRow {
  [columnId: string] : string | number | Date
}

export interface IGridColumn {
  id: string;
  title: string;
  headTooltip?: string;
  hide?: boolean;
  contentIfNull?: string;
  cellRenderer?: (originalValue: any, column: IGridColumn, row: IGridDataRow, meta: any) => string;
  allowSort?: boolean;
  comparer?: (a: any, b: any) => number;
  cellTooltip?: (value: any, renderedValue: any, column: IGridColumn, row: IGridDataRow, meta: any) => string;
  cellClick?: (event: Event, value: any, renderedValue: any, column: IGridColumn, row: IGridDataRow, meta: any) => void;
}
