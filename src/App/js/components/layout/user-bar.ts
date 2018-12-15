import m from 'mithril';
import { cssStylesAdd } from '../../services/css-service';

// language=CSS
cssStylesAdd(`.user-bar { float: right; margin-right: 2em; }`);

export const userBar = {
  view: view
};

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