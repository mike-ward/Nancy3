import m from 'mithril';
import { header } from './header';
import { footer } from './footer';

export const layout = {
  view: view
}

function view(v: m.Vnode) {
  return m('',
    {style: 'margin:1em'},
    m(header),
    v.children,
    m(footer));
}