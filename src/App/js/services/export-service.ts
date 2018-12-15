export function tableToExcel(tableNode: HTMLTableElement, name: string, filename: string) {
  const table = tableToHtml(tableNode);
  const worksheet = name || 'Worksheet';

  // language=html
  const template = `<html
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="UTF-8">
    <!--[if gte mso 9]>
      <xml>
        <o:DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
          <o:Author>My Application</o:Author>
          <o:Created>${(new Date()).getTime()}</o:Created>
        </o:DocumentProperties>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${worksheet}</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml><![endif]-->
    </head>
  <body>
    <table>${table}</table>
  </body>
  </html>`;

  download(template, 'application/vnd.ms-excel', filename);
  //const a = document.createElement('a');
  //const uri = 'data:application/vnd.ms-excel;base64,'
  //const base64 = function (s: string) { return window.btoa(unescape(encodeURIComponent(s))) }

  //a.href = uri + base64(template);
  //a.download = filename + '.xls';
  //a.click();

  // for multiple sheets, check: https://stackoverflow.com/questions/29698796/how-to-convert-html-table-to-excel-with-multiple-sheet
}

function tableToHtml(table: HTMLTableElement) {
  return table
    .innerHTML
    .replace(/(<\s*(?:tr|thead|tbody).*?>)/g, '\n$1')
    .replace(/(<\s*(?:th|td).*?>)/g, '\n  $1');
}

export function tableToCsv(table: HTMLTableElement, filename: string) {
  let data = '';
  let r: number;
  let c: number;
  let row: HTMLTableRowElement;
  let col: HTMLTableColElement | HTMLTableHeaderCellElement;

  // HTMLCollections are not arrays
  for (r = 0; r < table.rows.length; r = r + 1) {
    row = table.rows[r];
    for (c = 0; c < row.cells.length; c = c + 1) {
      col = row.cells[c];
      data = data + ',' + csvValue(col.textContent);
    }
    data = data + '\n';
  }

  download(data, 'text/csv;charset=utf-8;', filename);
}

function csvValue(value: string) {
  const val = !value ? '' : value;
  const quoteQuotes = val.replace(/"/g, '""');
  return quoteQuotes.search(/("|,|\n)/g) >= 0
    ? `"${quoteQuotes}"`
    : quoteQuotes;
}

function download(data: string, mime: string, filename: string) {
  const blob = new Blob([data], { type: mime });

  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  }

  else {
    const link = document.createElement("a");
    if (link.download !== undefined) {
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