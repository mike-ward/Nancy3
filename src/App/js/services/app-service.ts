//import 'purecss/build/pure-min.css';
import 'normalize.css/normalize.css';
import { cssStylesAdd, cssStylesInject } from './css-service';
import { buildRoutes } from './route-service';

export function startApp() {
  // language=css
  cssStylesAdd(`
    body {margin: 1em;font-family:helvetica;line-height:1.25}
    a {text-decoration:none;border-bottom:1px solid}
    .bold {font-weight:bold}
    .italic {font-style:italic}
  `);

  cssStylesInject();
  buildRoutes();
}