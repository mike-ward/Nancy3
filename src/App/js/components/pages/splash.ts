import m from 'mithril';

function view(v) {
  return `Splash: ${Date.now()}`;
}

export const splash: m.Component = {
  view: view
}