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

export function downloadCsv(gvm: IGridViewModel, filename: string) {
  const csv = exportCsv(gvm);
  download(csv, filename);
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

function download(csv: string, filename:string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  }

  else {
    const link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
