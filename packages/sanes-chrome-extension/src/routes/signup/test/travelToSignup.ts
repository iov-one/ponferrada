import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { SIGNUP_ROUTE } from '../../paths';
import { createDom } from '../../../utils/test/dom';
import { history } from '../../../store/reducers';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';

export const travelToSignup = async (
  store: Store
): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act(
    (): void => {
      history.push(SIGNUP_ROUTE);
    }
  );
  await whenOnNavigatedToRoute(store, SIGNUP_ROUTE);

  return dom;
};
