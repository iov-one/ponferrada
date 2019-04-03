import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { LOGIN_ROUTE } from '../../paths';
import { createDom } from '../../../utils/test/dom';
import { history } from '../../../store/reducers';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';

export const travelToLogin = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act(() => {
    history.push(LOGIN_ROUTE);
  });
  await whenOnNavigatedToRoute(store, LOGIN_ROUTE);

  return dom;
};
