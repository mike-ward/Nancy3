import m from 'mithril';
import { cssStylesAdd } from '../../services/css-service';

function view(vnode: any) {
  return m('span', vnode.attrs, [
    m('img.loading-img', { src: 'content/images/loading-rectangle.gif' }),
    m.trust('&nbsp;Loading&hellip;')
  ]);
}

// language=css
cssStylesAdd(`.loading-img { height: 16px; width: 16px; vertical-align: middle}`);

export const loading = {
  view: view,
}
