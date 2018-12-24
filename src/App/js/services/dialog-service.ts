import m from 'mithril';
import constants from './constants-service';
import { modal, closeModal } from './modal-service';

export function alert(message: string, title?: string): void {
  modal(m(`.card`, { clickBgCloses: true },
    m('.card-header', m('p.card-header-title', title || constants.appTitle)),
    m('.card-content', message)
  ));
}

export function confirm(message: string) {
  let _resolve: () => void;
  let _reject: () => void;

  const result = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  modal(m(`.card`,
    m('.card-header', m('p.card-header-title', constants.appTitle)),
    m('.card-content', message),
    m('.card-footer',
      m('a.card-footer-item', { onclick: () => closeModal(_resolve) }, 'Yes'),
      m('a.card-footer-item', { onclick: () => closeModal(_reject) }, 'No')
    )));

  return result;
}

export function prompt(message: string, value?: string): string | null {
  return prompt(message, value);
}