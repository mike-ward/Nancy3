import 'mustard-ui/dist/css/mustard-ui.min.css';
import { cssStylesAdd, cssStylesInject } from './css-service';
import { buildRoutes } from './route-service';

export function startApp() {
  // language=css
  cssStylesAdd(`
    body {line-height:1.25}
    .bold {font-weight:bold}
    .italic {font-style:italic}
    .nav-container{max-width:unset;padding:0 1rem}
  `);

  cssStylesInject();
  buildRoutes();
}