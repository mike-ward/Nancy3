import m from 'mithril';
import { addStyleSheet } from '../../services/dom-service';

// language=CSS
const css = `.user-bar { float: right; margin-right: 2em; }`;
addStyleSheet(css);

function view() {
  const pageData = (window as any).pageData;
  const isAdmin = pageData && pageData.isAdmin;

  const vn = m('.user-bar',
    isAdmin ? m('a', { href: 'admin/dashboard', oncreate: m.route.link }, 'Admin') : '',
    isAdmin ? ' | ' : '',
    m('a', { href: 'account/login', oncreate: m.route.link }, 'Login')
  );

  return vn;
}

export const userBar = {
  view: view
};