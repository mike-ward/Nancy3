import m from 'mithril';
import { addStyleSheet } from '../../services/dom-service';

function view(v: any) {
  const options = v.attrs.options;
  return options
    ? m('.nav-bar', options.items.map((item: any) => m('a', { href: item.link, oncreate: m.route.link }, item.name)))
    : null;
}

// language=css
const css = `
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
  }`;

addStyleSheet(css);

export const navBar = {
  view: view
}