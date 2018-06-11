import m from 'mithril';
import { header } from './header';
import { footer } from './footer';

export const layout = {
  view: view
}

function view(v) {
  return m('',
    m(header),
    v.children,
    m(footer));
}
