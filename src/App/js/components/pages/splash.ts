import m from 'mithril';

export const splash: m.FactoryComponent = () => {
  let timer: number;

  return {
    view: view,
    oninit: () => timer = setInterval(updateTime, 1000),
    onremove: () => clearInterval(timer),
  }
}

function view() {
  return new Date().toUTCString();
}

function updateTime() {
  m.redraw();
}
