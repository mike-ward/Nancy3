import m from 'mithril';
import constants from '../../../services/constants-service';
import { cssStylesAdd } from '../../../services/css-service';

// language=css
cssStylesAdd(`form.login-form { width: 25rem; margin: 5rem auto }`);

export const login = {
  view: view,
  oncreate: () => document.getElementById('email').focus()
}

function view() {
  return m('form.login-form',
    m('.page-title', `${constants.appTitle} Login`),
    m('.form-control',
      m("label[for='email']", 'Email'),
      m('input[id="email"][type="text"]')),
    m('.form-control',
      m('label[for="password"]', 'Password'),
      m('input[id="password"][type="password"]')),
    m('.form-control',
      m('button.button-primary[type="submit"]', 'Log in'))
  );
}