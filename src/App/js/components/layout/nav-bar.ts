import m from 'mithril';
import { cssStylesAdd } from '../../services/css-service';

// language=css
cssStylesAdd(`
  .nav-bar {
    margin: .25em auto;
  }
  .nav-bar a {
    margin: 0 1em;
    white-space: nowrap;
  }`
);

export interface INavbarOptions {
  items: { name: string, link: string }[];
}

export const navBar = {
  view: view
}

function view(v: m.Vnode) {
  const options = (v.attrs as any).options as INavbarOptions;
  return options
    ? m('.nav-bar', links(options))
    : null;
}

function links(options: INavbarOptions) {
  return options.items
    .map((item: any) => m('a', { href: item.link, oncreate: m.route.link }, item.name));
}