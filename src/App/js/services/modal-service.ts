import m from 'mithril';

const modalContainerId = 'modal-container-unique-id';

export function modal(content: string | m.Vnode) {
  const modalContainer = document.createElement('div');
  modalContainer.id = modalContainerId;
  document.body.appendChild(modalContainer);

  const view =
    m('.modal is-active',
      m('.modal-background'),
      m('.modal-content', m('', content)));

  m.mount(modalContainer, { view: () => view });

  const el = modalContainer.querySelector('input,button');
  if (el) (el as HTMLElement).focus();
}

export function closeModal() {
  const container = document.getElementById(modalContainerId);
  m.mount(container, null);
  container.remove();
}

