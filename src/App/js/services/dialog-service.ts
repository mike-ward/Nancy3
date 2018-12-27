import m from 'mithril';
import constants from './constants-service';
import { cssStylesAdd } from './css-service'
import { modal, closeModal } from './modal-service';

cssStylesAdd(
  `.message-foot{border-top: 1px solid gainsboro;padding:.5em 1rem;text-align:right}
   .message-foot button{margin:0 .3rem;min-width:5rem}`)

export function msg(message: string | m.Vnode, title?: string): void {
  modal(m(`.message.is-link`, { clickBgCloses: true },
    m('.message-header', [
      title || constants.appTitle,
      m('button.delete', {onclick: () => closeModal(null) })
      ]),
    m('.message-body', message)
  ));
}

export function yesNo(message: string | m.Vnode, title?: string) {
  let _resolve: () => void;
  let _reject: () => void;

  const result = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  modal(m(`.message.is-link`,
    m('.message-header', title || constants.appTitle),
    m('.message-body', message),
    m('.message-foot',
      m('button.button', { onclick: () => closeModal(_resolve) }, 'Yes'),
      m('button.button', { onclick: () => closeModal(_reject) }, 'No')
    )));

  return result;
}

export function prompt(message: string, value?: string): string | null {
  return window.prompt(message, value);
}