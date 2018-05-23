import m from 'mithril';
import addStyeSheet from '../../services/dom-service';
import { header } from './header';
import { footer } from './footer';

function view(v) {
  return m('',
    m(header),
    v.children,
    m(footer));
}

export const layout = {
  view: view
}