import m from 'mithril';

const modalContainerId = 'modal-container-unique-id';

export function modal(render: () => m.Children) {
  const modalContainer = document.createElement('div');
  modalContainer.id = modalContainerId;
  document.body.appendChild(modalContainer);

  try {
    const modalComponent = {
      view: () =>
        m('.modal is-active',
          m('.modal-background'),
          m('.modal-content', render()))
    }

    m.mount(modalContainer, modalComponent);

    const el = modalContainer.querySelector('input,button');
    if (el) (el as HTMLElement).focus();
  }
  catch (e) {
    closeModal();
    throw e;
  }
}

export function closeModal() {
  const container = document.getElementById(modalContainerId);
  m.mount(container, null);
  container.remove();
}