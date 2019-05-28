import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { Request } from '../../extension/background/model/signingServer/requestQueueManager';
import { aNewStore } from '../../store';
import { RootState } from '../../store/reducers';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { SHARE_IDENTITY, TX_REQUEST } from '../paths';
import { travelToRequests } from './test/travelToRequests';

describe('DOM > Feature > Requests', () => {
  const REQUEST_ONE: Request = {
    id: 1,
    type: 'getIdentities',
    reason: 'Reason 1',
    data: { senderUrl: 'www.sender1.com', requestedIdentities: [] },
    accept: jest.fn(),
    reject: jest.fn(),
  };

  const REQUEST_TWO: Request = {
    id: 2,
    type: 'signAndPost',
    reason: 'Reason 2',
    data: { senderUrl: 'www.sender2.com', tx: '' },
    accept: jest.fn(),
    reject: jest.fn(),
  };

  let store: Store<RootState>;
  let requestsDom: React.Component;

  beforeEach(() => {
    store = aNewStore();
  });

  it('redirects to the Share Identity view when a Request of type "getIdentities" is clicked', async () => {
    requestsDom = await travelToRequests(store, [REQUEST_ONE, REQUEST_TWO]);
    const identityRequest = TestUtils.scryRenderedDOMComponentsWithTag(requestsDom, 'li')[0];

    TestUtils.act(() => {
      TestUtils.Simulate.click(identityRequest);
    });

    await whenOnNavigatedToRoute(store, SHARE_IDENTITY);
  }, 55000);

  it('redirects to the TX Request view when a Request of type "signAndPost" is clicked', async () => {
    requestsDom = await travelToRequests(store, [REQUEST_TWO, REQUEST_ONE]);
    const txRequest = TestUtils.scryRenderedDOMComponentsWithTag(requestsDom, 'li')[0];

    TestUtils.act(() => {
      TestUtils.Simulate.click(txRequest);
    });

    await whenOnNavigatedToRoute(store, TX_REQUEST);
  }, 55000);
});
