import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { aNewStore } from '../../store';
import { travelToShareIdentity } from './test/travelToShareIdentity';
import {
  clickOnAcceptButton,
  clickOnBackButton,
  clickOnRejectButton,
  confirmSelectionButton,
  checkPermanentRejection,
} from './test/operateShareIdentity';

describe('DOM > Feature > Share Identity', (): void => {
  let store: Store<RootState>;
  let identityDOM: React.Component;

  beforeEach(async () => {
    store = aNewStore();
    identityDOM = await travelToShareIdentity(store);
  });

  it('should accept incoming request and come back', async (): Promise<void> => {
    await clickOnAcceptButton(identityDOM);
    await confirmSelectionButton(identityDOM);
    //TODO: Check here that share request rejection has been reject successfuly

    /**
     * Remove this code if not required in case if there is another redirection
     * in confirmAcceptButton method. And apply this method in separate test method.
     */
    await clickOnBackButton(identityDOM);
  }, 55000);

  it('should reject incoming request and come back', async (): Promise<void> => {
    await clickOnRejectButton(identityDOM);
    await confirmSelectionButton(identityDOM);
    //TODO: Check here that share request rejection has been reject successfuly

    /**
     * Remove this code if not required in case if there is another redirection
     * in confirmAcceptButton method. And apply this method in separate test method.
     */
    await clickOnBackButton(identityDOM);
  }, 55000);

  it('should reject incoming request permanently and come back', async (): Promise<void> => {
    await clickOnRejectButton(identityDOM);
    await checkPermanentRejection(identityDOM);
    await confirmSelectionButton(identityDOM);
    //TODO: Check here that share request rejection has been reject successfuly and permanent
    //rejection flag has been set
  }, 55000);
});
