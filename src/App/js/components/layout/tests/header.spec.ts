import '../../../browserMock';
import mq from 'mithril-query';
import { header } from '../header';

test('header should contain div.header', () => {
  const out = mq(header.view());
  out.should.have('div.header');
});
