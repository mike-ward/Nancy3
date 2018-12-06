import '../../../browserMock';
import mq from 'mithril-query';
import { footer } from '../footer';

test('footer should contain div.footer', () => {
  const out = mq(footer.view());
  out.should.have(1, 'div.footer');
});
