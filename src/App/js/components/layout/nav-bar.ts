import m from 'mithril';
import { userBar } from './user-bar';

export interface INavbarOptions {
  items: { name: string, link: string }[];
}

export const navBar = {
  view: view
}

function view(v: m.Vnode) {
  const options = (v.attrs as any).options as INavbarOptions;
  const menuType = (v.attrs as any).menuType as string;
  return options
    ? m('ul.' + menuType,
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
        className: isActiveLink(m.route.get(), item.name) ? 'active' : null
      }, item.name)));
}

function isActiveLink(route: string, name: string) {
  return route.toLowerCase().indexOf(name.toLowerCase()) >= 0
}