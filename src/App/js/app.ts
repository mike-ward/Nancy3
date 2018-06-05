declare var module: any;
module.hot && module.hot.accept();

// true if IE less than 9
if (!-[1,]) alert('Internet Explorer 7 and 8 are not supported');

import m from 'mithril';
import stream from 'mithril/stream';
import { startApp } from './services/app-service'


startApp();