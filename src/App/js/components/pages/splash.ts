import m from 'mithril';

function view(v) {
  return `Splash: ${v.state.count}`;
}

export const splash: m.Component = {
  oninit: v => { v.state.count = Date.now() },
  view: view
}