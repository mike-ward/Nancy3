import m from 'mithril';
import constants from '../../../services/constants-service';
import { addStyleSheet } from '../../../services/dom-service';

const css = `
  form.login-form { width: 30rem; margin: 5rem auto }
  form.login-form label { margin-top: 1em }
  form.login-form button { margin-top: 1em }
`;

addStyleSheet(css);

function view() {
  return m('form.pure-form.pure-form-stacked.login-form',
    m('fieldset',
      m('legend', `${constants.appTitle} Login`),
      m("label[for='email']", 'Email'),
      m('input.pure-input-2-3[id="email"][type="email"]'),
      m('span.pure-form-message', 'This is a required field.'),
      m('label[for="password"]', 'Password'),
      m('input.pure-input-2-3[id="password"][type="password"]'),
      m('button.pure-button.pure-button-primary[type="submit"]', 'Sign in')
    )
  );
}

export const login = {
  view: view
}
