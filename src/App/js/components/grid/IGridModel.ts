export interface IGridModel {
  columns: IGridColumn[];
  data: IGridDataRow[];
  key?: string; // column id
  meta?: any;
}

export interface IGridDataRow {
  [columnId: string]: any;
}

export interface IGridColumn {
  id: string;
  title: string;
  hide?: boolean;
  headTooltip?: string;

  allowSort?: boolean;
  sortLevel?: number;
  sortDirection?: number;
  comparer?: (a: any, b: any) => number;

  contentIfNull?: string;
  cellRenderer?: (originalValue: any, column: IGridColumn, row: IGridDataRow, meta: any) => string;
  cellTooltip?: (value: any, renderedValue: any, column: IGridColumn, row: IGridDataRow, meta: any) => string;
  cellClick?: (event: Event, value: any, renderedValue: any, column: IGridColumn, row: IGridDataRow, meta: any) => void;
}
