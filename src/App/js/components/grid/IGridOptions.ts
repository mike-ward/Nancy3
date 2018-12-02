﻿export interface IGridOptions {
  columns: IGridColumn[];
  data: {}[];
  key?: string | Function;
  meta?: any;
}

export interface IGridColumn {
  id: string;
  title: string;
  headTooltip?: string;
  hide?: boolean;
  contentIfNull?: string;
  cellRenderer?: (value: any, column: IGridColumn, state: any) => string;
  allowSort?: boolean;
  comparer?: (a: any, b: any) => number;
  cellClick?: (value: any, column: IGridColumn, state: any) => void;
  cellTooltip?: (value: any, column: IGridColumn, state: any) => void;
}