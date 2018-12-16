import m from 'mithril';
import { cssStylesAdd } from '../../services/css-service';

// language=CSS
cssStylesAdd(`.foot{margin-top:5rem;}`);

export const footer = {
  view: view
}

function view() {
  return m('.foot',
    m('hr'),
    m('', 'footer stuff goes here')
  );
}