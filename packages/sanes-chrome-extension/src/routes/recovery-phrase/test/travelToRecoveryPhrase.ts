import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { RECOVERY_PHRASE_ROUTE, WELCOME_ROUTE } from '../../paths';
import { createDom } from '../../../utils/test/dom';
import { history } from '../../../store/reducers';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { sleep } from '../../../utils/timer';

export const travelToRecoveryPhrase = async (
  store: Store
): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act(
    (): void => {
      history.push(WELCOME_ROUTE); //I need this to test "Back" button behaviour
      history.push(RECOVERY_PHRASE_ROUTE);
    }
  );
  await whenOnNavigatedToRoute(store, RECOVERY_PHRASE_ROUTE);

  // TODO: Once the db and persona deletion is available, make this process deterministic, removing the sleep.
  //should wait until Profile will be created and mnemonic become available
  await sleep(1000);

  return dom;
};
