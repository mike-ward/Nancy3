import m from 'mithril';
import { msg, yesNo } from '../../services/dialog-service';

export const modals: m.Component = {
  view: view
}

function view() {
  return [
    m('.page-title', 'Modals'),
    m('.columns', examples.map(example => [
      m('.column.is-narrow',
        m('.button.button', { onclick: example.modal }, example.text))
    ]))
  ];
}

var examples = [
  { text: 'Message Modal', modal: () => msg('Example message modal') },
  { text: 'Message Modal with Markup', modal: () => AlertWithMarkup() },
  {
    text: 'Yes/No Modal', modal: () =>
      yesNo('Do you want Oreos?')
        .then(
          () => msg('Then go buy some you lazy bum!'),
          () => msg('Aw shucks!'))
  },
  { text: 'Prompt Modal', modal: () => msg('Comming soon!') },
]

function AlertWithMarkup() {
  return msg(m('.content',
    m('.subtitle', 'Lorem ipsum'),
    m('blockquote', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan, metus ultrices eleifend gravida, ' +
      'nulla nunc varius lectus, nec rutrum justo nibh eu lectus. Ut vulputate semper dui. Fusce erat odio, sollicitudin vel erat vel, ' +
      'interdum mattis neque.')
  ), 'Message with Markup');
}