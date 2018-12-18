import m from 'mithril';

export const userBar = {
  view: view
};

function view() {
  const pageData = (window as any).pageData;
  const isAdmin = pageData && pageData.isAdmin;

  const vn = [
    isAdmin ? m('li', m('a', { href: 'admin/dashboard', oncreate: m.route.link }, 'Admin')) : '',
    m('li', m('a', { href: 'account/login', oncreate: m.route.link }, 'Login'))
  ];

  return vn;
}