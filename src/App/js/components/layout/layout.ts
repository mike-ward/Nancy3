import m from 'mithril';
import { header } from './header';
import { footer } from './footer';

export const layout = {
  view: view
}

function view(v: m.Vnode) {
  return m('',
    m(header),
    m('',
      { style: 'margin: 1em' },
      v.children,
      m(footer)));
}