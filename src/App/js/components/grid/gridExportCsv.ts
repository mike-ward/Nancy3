import { IGridViewModel } from 'gridViewModel';

export function exportCsv(gvm: IGridViewModel) {
  const columns = gvm.columns.map(vm => vm.name)
    .map(sanitize)
    .join(',');

  const rows = gvm.vrows.map(
    vr => gvm.columns.map(col =>
      vr.data.get(col.id).value)
      .map(sanitize)
      .join(','))
    .join('\n');

  const csv = `${columns}\n${rows}`;
  return csv;
}

function sanitize(value: any) {
  const asString = (value === null || value === undefined)
    ? ''
    : value instanceof Date
      ? value.toLocaleString()
      : value.toString();

  const quoteQuotes = asString.replace(/"/g, '""');

  const sanitized = quoteQuotes.search(/("|,|\n)/g) >= 0
    ? `"${quoteQuotes}"`
    : quoteQuotes;

  return sanitized;
}

