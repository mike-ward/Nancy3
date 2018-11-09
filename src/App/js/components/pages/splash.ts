import m from 'mithril';

function view() {
  return `Splash: ${Date.now()}`;
}

export const splash: m.Component = {
  view: view
}