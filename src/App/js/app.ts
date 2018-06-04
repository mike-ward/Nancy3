declare var module: any;
module.hot && module.hot.accept();

// true if IE less than 9
if (!-[1,]) alert('Internet Explorer 7 and 8 are not supported');

import m from 'mithril';
import stream from 'mithril/stream';
import { startApp } from './services/app-service'

const model:any = {}
const update = stream();
const models = stream.scan((model: any, func: any) => func(model), model, update);
const root = document.getElementById('app') as Element;
models.map(mdl => m.render(root, model.component && m(model.component)));

startApp(update)(model);