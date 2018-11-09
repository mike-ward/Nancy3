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
    text-decoration: none;
  }
  .nav-bar a:hover {
    border-bottom: solid 1px;
  }`
);

export const navBar = {
  view: view
}

function view(v: any) {
  const options = v.attrs.options;
  return options
    ? m('.nav-bar', links(options))
    : null;
}

function links(options) {
  return options.items
    .map((item: any) => m('a', { href: item.link, oncreate: m.route.link }, item.name));
}