import m from 'mithril';
import stream from 'mithril/stream';

export interface IGridAttrs extends m.Attributes {
  model: stream.Stream<IGridModel>
}

export interface IGridModel {
  columns: IGridColumn[];
  data: IGridRow[];
  /** Used to assoicate DOM elements with data array items. If specified, must be a column id. Typically not needed.*/
  key?: string;
  /** Extra stuff that gets passed to cell renderers, cell click handlers and cell tootips */
  meta?: any;
}

export interface IGridColumn {
  id: string;
  name: string;
  /** Can use mithril's strings https://mithril.js.org/hyperscript.html#style-attribute */
  css?: string | object;
  hide?: boolean;
  tooltip?: string;
  /** Determines the order of columns displayed (not implemented) */
  ordinal?: number;

  /** When enabled, changes cursor to "pointer" and adds direction arrows, click handlers */
  sortEnable?: boolean;
  /** Multi-column sorting order (not implemented) */
  sortLevel?: number;
  /** 1 = up, -1 = down */
  sortDirection?: number;
  /** Defaults to compareService.sortAny() when sortAllow is true */
  sortComparer?: (a: IGridRow, b: IGridRow) => number;

  /** Tooltip to display when hovering over cell */
  cellTooltip?: (value: any, renderedValue: any, column: IGridColumn, row: IGridRow, meta: any) => string;
  /** Action to take when cell is clicked. If specified, grid changes cursor style to "pointer" */
  cellClick?: (event: Event, value: any, renderedValue: any, column: IGridColumn, row: IGridRow, meta: any) => void;
  /** Allows custom rendering of values. Commonly used to handle null/empty values  */
  cellRenderer?: (originalValue: any, column: IGridColumn, row: IGridRow, meta: any) => string;
}

export interface IGridRow {
  [columnId: string]: any;
}