import m from 'mithril';

export const splash: m.Component = {
  view: view,
  oninit: (v: m.Vnode) => (v.state as any)['timer'] = setInterval(updateTime, 1000),
  onremove: (v: m.Vnode) => clearInterval((v.state as any)['timer']),
}

function view() {
  return new Date().toUTCString();
}

function updateTime() {
  m.redraw();
}
