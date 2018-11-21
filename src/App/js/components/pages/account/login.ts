import m from 'mithril';
import constants from '../../../services/constants-service';
import { cssStylesAdd } from '../../../services/css-service';

// language=css
cssStylesAdd(`
  form.login-form { width: 30rem; margin: 5rem auto }
  form.login-form label { margin-top: 1rem }
  form.login-form button { margin-top: 1rem }
`);

export const login = {
  view: view,
  oncreate: () => document.getElementById('email').focus()
}

function view() {
  return m('form.pure-form.pure-form-stacked.login-form',
    m('fieldset',
      m('legend', m('.bold', `${constants.appTitle} Sign In`)),
      m("label[for='email']", 'Email'),
      m('input.pure-input-2-3[id="email"][type="email"]'),
      m('span.pure-form-message', 'This is a required field.'),
      m('label[for="password"]', 'Password'),
      m('input.pure-input-2-3[id="password"][type="password"]'),
      m('button.pure-button.pure-button-primary[type="submit"]', 'Sign in')
    )
  );
}
