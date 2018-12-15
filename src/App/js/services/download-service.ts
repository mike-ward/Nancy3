export function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

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

export function tableToExcel(tableNode: any, name: string, filename: string) {
  const worksheet = name || 'Worksheet';

  const table = tableNode
    .innerHTML
    .replace(/(<\s*(?:tr|thead|tbody).*?>)/g, '\n$1')
    .replace(/(<\s*(?:th|td).*?>)/g, '\n  $1');

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

  const a = document.createElement('a');
  const uri = 'data:application/vnd.ms-excel;base64,'
  const base64 = function (s: string) { return window.btoa(unescape(encodeURIComponent(s))) }

  a.href = uri + base64(template);
  a.download = filename + '.xls';
  a.click();

  //for multiple sheets, check: https://stackoverflow.com/questions/29698796/how-to-convert-html-table-to-excel-with-multiple-sheet
  //check source of http://demos.w3lessons.info/jquery-table-export plugin in http://demos.w3lessons.info/assets/jstableexport/tableExport.js
}