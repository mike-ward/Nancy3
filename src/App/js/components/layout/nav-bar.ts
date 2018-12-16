import m from 'mithril';
import { userBar } from './user-bar';

// language=css
export interface INavbarOptions {
  items: { name: string, link: string }[];
}

export const navBar = {
  view: view
}

function view(v: m.Vnode) {
  const options = (v.attrs as any).options as INavbarOptions;
  return options
    ? m('ul.nav-links',
        links(options),
        m(userBar))
    : null;
}

function links(options: INavbarOptions) {
  return options.items
    .map((item: any) => m('li', m('a',
      {
        href: item.link,
        oncreate: m.route.link,
        className: m.route.get().toLowerCase().indexOf(item.name.toLowerCase()) >= 0 ? 'active' : null
      }, item.name)));
}