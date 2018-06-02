export interface IGridOptions {
  columns: IGridColumn[];
  data: {}[];
  key?: string | Function;
  meta?: any;
}

export interface IGridColumn {
  id: string;
  title: string;
  tooltip?: string;
  hide?: boolean;
  contentIfNull?: string;
  renderer?: (v: any) => string;
  allowSort?: boolean;
  comparer?: (a: any, b: any) => number;
  cellClick?: (value: any) => void;
  cellTooltip?: (value: any) => void;
}