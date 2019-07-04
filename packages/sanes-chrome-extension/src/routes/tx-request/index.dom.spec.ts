import { Address } from '@iov/bcp';
import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { Request } from '../../extension/background/model/signingServer/requestQueueManager';
import { aNewStore } from '../../store';
import { RootState } from '../../store/reducers';
import { click } from '../../utils/test/dom';
import { travelToTXRequest, whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { sleep } from '../../utils/timer';
import { getTransaction, getUsernameTransaction } from './test';
import {
  checkPermanentRejection,
  clickOnBackButton,
  clickOnRejectButton,
  confirmRejectButton,
} from './test/operateTXRequest';
import { REQUEST_ROUTE } from '../paths';
import { findRenderedDOMComponentWithId } from '../../utils/test/reactElemFinder';
import { REQ_SEND_TX } from './components/ShowRequest/ReqSendTransaction';
import { REQ_REGISTER_USERNAME } from './components/ShowRequest/ReqRegisterUsernameTx';

const sendRequests: ReadonlyArray<Request> = [
  {
    id: 1,
    type: 'signAndPost',
    reason: 'Test get Identities',
    data: {
      senderUrl: 'http://finnex.com',
      creator: '0x873fAA4cdDd5b157e8E5a57e7a5479AFC5aaaaaa' as Address,
      tx: getTransaction(),
    },
    accept: jest.fn(),
    reject: jest.fn(),
  },
];

describe('DOM > Feature > Transaction Request', (): void => {
  let store: Store<RootState>;
  let identityDOM: React.Component;

  beforeEach(async () => {
    store = aNewStore();
    identityDOM = await travelToTXRequest(store, sendRequests);
  }, 60000);

  it('should accept incoming request and redirect to account status view', async (): Promise<void> => {
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(identityDOM, 'button');

    expect(inputs.length).toBe(2);

    const acceptButton = inputs[0];
    click(acceptButton);

    await whenOnNavigatedToRoute(store, REQUEST_ROUTE);
  }, 60000);

  it('should reject incoming request and come back', async (): Promise<void> => {
    await clickOnRejectButton(identityDOM);
    await confirmRejectButton(identityDOM);
    //TODO: Check here that share request rejection has been reject successfuly

    /**
     * Remove this code if not required in case if there is another redirection
     * in confirmAcceptButton method. And apply this method in separate test method.
     */
    await clickOnBackButton(identityDOM);
  }, 60000);

  it('should reject incoming request permanently and come back', async (): Promise<void> => {
    await clickOnRejectButton(identityDOM);
    await checkPermanentRejection(identityDOM);
    await confirmRejectButton(identityDOM);
    await sleep(2000);
    //rejection flag has been set
  }, 60000);
});

describe('DOM > Feature > Send Transaction Request', (): void => {
  let store: Store<RootState>;
  let identityDOM: React.Component;

  beforeEach(async () => {
    store = aNewStore();
    identityDOM = await travelToTXRequest(store, sendRequests);
  }, 60000);

  it('should show send transaction request accept view', async (): Promise<void> => {
    await findRenderedDOMComponentWithId(identityDOM, REQ_SEND_TX);
  }, 60000);
});

describe('DOM > Feature > Username Registration Request', (): void => {
  const requests: ReadonlyArray<Request> = [
    {
      id: 1,
      type: 'signAndPost',
      reason: 'Test username registration',
      data: {
        senderUrl: 'http://finnex.com',
        creator: '0x873fAA4cdDd5b157e8E5a57e7a5479AFC5aaaaaa' as Address,
        tx: getUsernameTransaction(),
      },
      accept: jest.fn(),
      reject: jest.fn(),
    },
  ];

  let store: Store<RootState>;
  let identityDOM: React.Component;

  beforeEach(async () => {
    store = aNewStore();
    identityDOM = await travelToTXRequest(store, requests);
  }, 60000);

  it('should show register username request accept view', async (): Promise<void> => {
    await findRenderedDOMComponentWithId(identityDOM, REQ_REGISTER_USERNAME);
  }, 60000);
});
