import m from 'mithril';
import { addStyleSheet } from '../../services/dom-service';

// language=CSS
const css = `.footer{margin-top:5rem;}`;
addStyleSheet(css);

export const footer = {
  view: view
}

function view() {
  return m(
    '.footer', [
      m('hr'),
      m('.app-footer', 'footer stuff goes here')
    ]);
}
