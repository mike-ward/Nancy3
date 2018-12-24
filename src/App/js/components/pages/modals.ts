import m from 'mithril';
import { alert, confirm } from '../../services/dialog-service';

var examples = [
  { text: 'Alert/Info Modal', modal: () => alert('Example alert modal') },
  {
    text: 'Comfirmation Modal', modal: () =>
      confirm('Do you want Oreos?')
        .then(
          () => alert('Then go by some you lazy bum!'),
          () => alert('Aw shucks!'))
  },
  { text: 'Prompt Modal', modal: () => alert('Comming soon!') },
]

function view() {
  return [
    m('.page-title', 'Modals'),
    m('.columns', examples.map(example => [
      m('.column.is-narrow',
        m('.button.button', { onclick: example.modal }, example.text))
    ]))
  ];
}

export const modals: m.Component = {
  view: view
}