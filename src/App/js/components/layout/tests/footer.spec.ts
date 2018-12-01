import '../../../browserMock';
import { footer } from '../footer';

  test('footer should contain test', () => {
    const vnode = footer.view();
    expect(vnode.tag).toBe('div');
  });
