import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { RESTORE_ACCOUNT } from '../../paths';
import { createDom } from '../../../utils/test/dom';
import { history } from '../../../store/reducers';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';

export const travelToRestoreAccount = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act(
    (): void => {
      history.push(RESTORE_ACCOUNT);
    }
  );
  await whenOnNavigatedToRoute(store, RESTORE_ACCOUNT);

  return dom;
};
