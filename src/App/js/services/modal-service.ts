import m from 'mithril';

const modalContainerId = 'modal-container-unique-id';

export function modal(content: m.Vnode | m.Vnode[] | m.ComponentTypes) {
  const modalContainer = document.createElement('div');
  modalContainer.id = modalContainerId;
  document.body.appendChild(modalContainer);

  try {
    const isComponentType =
      typeof (content as any) === 'function' ||
      typeof (content as any).view === 'function';

    const vnode = isComponentType
      ? m(content as any)
      : content;

    const modalComponent = {
      view: () =>
        m('.modal is-active',
          m('.modal-background'),
          m('.modal-content', vnode as any))
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