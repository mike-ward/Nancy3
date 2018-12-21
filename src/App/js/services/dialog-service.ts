import m from 'mithril';
import constants from './constants-service';

export function alert(message: string, title?: string): void {
  modal(m(`.card`,
    m('.card-header', m('p.card-header-title', title || constants.appTitle)),
    m('.card-content', message)
  ));
}

export function confirm(message: string) {
  modal(m(`.card`,
    m('.card-header', m('p.card-header-title', constants.appTitle)),
    m('.card-content', message),
    m('.card-footer',
      m('a.card-footer-item', { onclick: closeModal }, 'Yes'),
      m('a.card-footer-item', { onclick: closeModal }, 'No')
    )));
}

export function prompt(message: string, value?: string): string | null {
  return prompt(message, value);
}

const modalContainerId = 'modal-container';

function closeModal() {
  document.getElementById(modalContainerId).remove();
}

export function modal(content: string | m.Vnode) {
  const view =
    m('.modal is-active',
      m('.modal-background', { onclick: () => modalContainer.remove() }),
      m('.modal-content', m('', content)));

  const modalContainer = document.createElement('div');
  modalContainer.id = modalContainerId;
  document.body.appendChild(modalContainer);
  m.render(modalContainer, view);
}