import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';

import { history } from '../../../store/reducers';
import { createDom } from '../../../utils/test/dom';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { sleep } from '../../../utils/timer';
import { RECOVERY_PHRASE_ROUTE, WELCOME_ROUTE } from '../../paths';

export const travelToRecoveryPhrase = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);

  const navigate = async (): Promise<void> => {
    history.push(WELCOME_ROUTE); //I need this to test "Back" button behaviour
    history.push(RECOVERY_PHRASE_ROUTE);
    await whenOnNavigatedToRoute(store, RECOVERY_PHRASE_ROUTE);
    await sleep(1000);
  };
  // FIXME  Once this is updated https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-dom/test-utils/index.d.ts#L296
  await TestUtils.act(navigate as any); //eslint-disable-line @typescript-eslint/no-explicit-any

  return dom;
};
