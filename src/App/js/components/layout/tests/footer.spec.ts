declare let global: any;
import browser from 'mithril/test-utils/browserMock';
global.window = browser();
global.document = window;

import { footer } from '../footer';

  test('footer should contain test', () => {
    const vnode = footer.view();
    expect(vnode.tag).toBe('div');
  });
