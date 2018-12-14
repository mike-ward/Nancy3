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

export function tableToExcel(table: any, name: string, filename: string) {
  const uri = 'data:application/vnd.ms-excel;base64,'

  // language=html
  const template = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]>
    <xml><o:DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><o:Author>Dominik Dumaine</o:Author><o:Created>${(new Date()).getTime()}</o:Created></o:DocumentProperties>
    <x:ExcelWorkbook><x:ExcelWorksheets>
    <x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body>
    <table>{table}</table>
    </body>
    </html>`;

  const base64 = function (s: string) { return window.btoa(unescape(encodeURIComponent(s))) }
  const format = function (s: string, c: any) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
  const ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }

  const a = document.createElement('a');
  const formattedXML = format(template, ctx);
  a.href = uri + base64(formattedXML);
  a.download = filename + '.xls';
  a.click();

  //for multiple sheets, check: https://stackoverflow.com/questions/29698796/how-to-convert-html-table-to-excel-with-multiple-sheet
  //check source of http://demos.w3lessons.info/jquery-table-export plugin in http://demos.w3lessons.info/assets/jstableexport/tableExport.js
}
