import m from 'mithril';
import { alert, confirm } from '../../services/dialog-service';

function view() {
  return [
    m('.page-title', 'Modals'),
    m('.box',
      m('.button.button', { onclick: () => alert('Example alert modal') }, 'Show Info Alert'),
      '\u2003',
      m('.button.button', { onclick: () => confirm('Example confirm modal') }, 'Show Confirmation Dialog')
    )
  ];
}

export const modals: m.Component = {
  view: view
}