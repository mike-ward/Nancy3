import * as window from 'mithril/test-utils/browserMock';
import { footer } from '../footer';
import { o } from 'mithril/ospec';

o.spec('footer', () => {

  o('footer should contain test', () => {
    const vnode = footer.view();
    o(vnode.tag).equals('pp');
  });

});