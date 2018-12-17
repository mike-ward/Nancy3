import m from 'mithril';

function view() {
  return [
    m('.page-title', 'About'),
    'This space for rent'
  ];
}

export const about: m.Component = {
  view: view
}