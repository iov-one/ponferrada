import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { history } from '../../../store/reducers';
import { createDom } from '../../../utils/test/dom';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { WELCOME_ROUTE } from '../../paths';

export const travelToWelcome = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act(
    (): void => {
      history.push(WELCOME_ROUTE);
    },
  );
  await whenOnNavigatedToRoute(store, WELCOME_ROUTE);

  return dom;
};
