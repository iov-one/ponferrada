import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';

import { history } from '../../../store/reducers';
import { createDom } from '../../../utils/test/dom';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { LOGIN_ROUTE } from '../../paths';

export const travelToLogin = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act(
    (): void => {
      history.push(LOGIN_ROUTE);
    },
  );
  await whenOnNavigatedToRoute(store, LOGIN_ROUTE);

  return dom;
};
