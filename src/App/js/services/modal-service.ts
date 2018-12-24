import m from 'mithril';
const modalContainerId = 'modal-container';

export function modal(content: string | m.Vnode) {
  const clickBgCloses = (<m.Vnode>content).attrs && (<any>(<m.Vnode>content).attrs)['clickBgCloses'];

  const view =
    m('.modal is-active',
      m('.modal-background', { onclick: () => clickBgCloses ? modalContainer.remove() : null }),
      m('.modal-content', m('', content)));

  const modalContainer = document.createElement('div');
  modalContainer.id = modalContainerId;
  document.body.appendChild(modalContainer);
  m.render(modalContainer, view);
}

export function closeModal(result: () => void) {
  document.getElementById(modalContainerId).remove();
  if (result) result();
}