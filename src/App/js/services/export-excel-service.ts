import constants from './constants-service';
import { download } from './download-service';

export function tableToExcel(tableNode: HTMLTableElement, name: string, filename: string) {
  const table = tableToHtml(tableNode);
  const worksheet = name || 'Worksheet';
  const data = template(worksheet, table);
  download(data, 'application/vnd.ms-excel', filename);
  // for multiple sheets, check: https://stackoverflow.com/questions/29698796/how-to-convert-html-table-to-excel-with-multiple-sheet
}

function tableToHtml(table: HTMLTableElement) {
  return table
    .innerHTML
    // make it pretty
    .replace(/(<\s*(?:tr|tbody).*?>)/g, '\n$1')
    .replace(/(<\s*(?:th|td).*?>)/g, '\n  $1');
}

function template(worksheet: string, table: string) {
  // language=html
  return `<html
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="UTF-8">
    <!--[if gte mso 9]>
      <xml>
        <o:DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
          <o:Author>${constants.appTitle}</o:Author>
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
}