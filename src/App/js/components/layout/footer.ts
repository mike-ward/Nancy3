import m from 'mithril';
import { cssStylesAdd } from '../../services/css-service';

// language=CSS
cssStylesAdd(`.footer{margin-top:5rem;}`);

export const footer = {
  view: view
}

function view() {
  return m(
    '.footer',
    m('hr'),
    m('.app-footer', 'footer stuff goes here')
  );
}