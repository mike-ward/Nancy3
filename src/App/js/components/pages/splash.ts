import m from 'mithril';
import constants from '../../services/constants-service';

export const splash: m.FactoryComponent = () => {
  let timer: any;

  return {
    view: view,
    oninit: () => timer = setInterval(updateTime, 1000),
    onremove: () => clearInterval(timer),
  }
}

function view() {
  return m('.header',
    m('h1', constants.appTitle),
    m('button.button-primary', {href: 'news', oncreate: m.route.link}, 'Get Started'),
    new Date().toUTCString());
}

function updateTime() {
  m.redraw();
}