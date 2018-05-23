import m from 'mithril';
import { addStyleSheet } from '../../services/dom-service';

function view() {
  return m(
    '.footer', [
      m('hr'),
      m('.app-footer', 'footer stuff goes here')
    ]);
}

// language=CSS
const css = `.footer{margin-top:5rem;}`;
addStyleSheet(css);

export const footer = {
  view: view
}