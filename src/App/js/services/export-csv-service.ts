import stream from 'mithril/stream';
import { download } from './download-service';
import { IGridModel } from '../components/grid/grid-interfaces';
import { gridViewModelStream, IGridViewRow } from '../components/grid/grid-view-model';

export function gridToCsv(model: stream.Stream<IGridModel>, filename: string) {
  const vm = gridViewModelStream(model)();
  const columns = vm
    .columns
    .filter(col => !col.hide);
  const head = columns
    .map(col => csvValue(col.name))
    .join(',');
  const asRow = (vr: IGridViewRow) => columns
    .map(col => csvValue(vr.data.get(col.id).value))
    .join(',');
  const rows = vm.vrows.map(vr => asRow(vr));
  const csv = [head].concat(rows).join('\n');
  download(csv, 'text/csv;charset=utf-8;', filename);
}

export function tableToCsv(table: HTMLTableElement, filename: string) {
  const rows = [];
  // HTMLCollections are not arrays
  for (let r = 0; r < table.rows.length; r = r + 1) {
    const row = table.rows[r];
    const cols = [] as any[];
    for (let c = 0; c < row.cells.length; c = c + 1) {
      const col = row.cells[c].innerText;
      cols.push(csvValue(col));
    }
    rows.push(cols.join(','));
  }
  download(rows.join('\n'), 'text/csv;charset=utf-8;', filename);
}

function csvValue(value: string) {
  const val = !value ? '' : value;
  const quoteQuotes = val.replace(/"/g, '""');
  return quoteQuotes.search(/("|,|\n)/g) >= 0
    ? `"${quoteQuotes}"`
    : quoteQuotes;
}