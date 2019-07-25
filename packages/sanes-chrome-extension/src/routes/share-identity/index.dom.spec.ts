import { Address } from '@iov/bcp';
import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';

import { Request } from '../../extension/background/model/signingServer/requestQueueManager';
import { aNewStore } from '../../store';
import { RootState } from '../../store/reducers';
import { click } from '../../utils/test/dom';
import { travelToShareIdentity } from '../../utils/test/navigation';
import { sleep } from '../../utils/timer';
import {
  checkPermanentRejection,
  clickOnBackButton,
  clickOnRejectButton,
  confirmRejectButton,
} from './test/operateShareIdentity';

describe('DOM > Feature > Share Identity', (): void => {
  const requests: ReadonlyArray<Request> = [
    {
      id: 1,
      senderUrl: 'http://finnex.com',
      reason: 'Test get Identities',
      responseData: {
        requestedIdentities: [
          {
            chainName: 'Ganache',
            address: '0x873fAA4cdDd5b157e8E5a57e7a5479AFC5d3aaaa' as Address,
          },
        ],
      },
      accept: jest.fn(),
      reject: jest.fn(),
    },
  ];

  let store: Store<RootState>;
  let identityDOM: React.Component;

  beforeEach(async () => {
    store = aNewStore();
    identityDOM = await travelToShareIdentity(store, requests);
  }, 60000);

  it('should accept incoming request and redirect to account status view', async (): Promise<void> => {
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(identityDOM, 'button');

    expect(inputs.length).toBe(2);

    const acceptButton = inputs[0];
    click(acceptButton);

    //TODO: Check here that share request has been accepted successfuly
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
