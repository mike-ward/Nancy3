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
  name: string;
  css?: string | object;
  hide?: boolean;
  tooltip?: string;
  ordinal?: number;

  sortAllow?: boolean;
  sortLevel?: number;
  sortDirection?: number;
  sortComparer?: (a: any, b: any) => number;

  cellContentIfNull?: string;
  cellRenderer?: (originalValue: any, column: IGridColumn, row: IGridDataRow, meta: any) => string;
  cellTooltip?: (value: any, renderedValue: any, column: IGridColumn, row: IGridDataRow, meta: any) => string;
  cellClick?: (event: Event, value: any, renderedValue: any, column: IGridColumn, row: IGridDataRow, meta: any) => void;
}
