import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';

import { history } from '../../../store/reducers';
import { createDom } from '../../../utils/test/dom';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { TX_REQUEST } from '../../paths';

export const travelToTXRequest = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act(
    (): void => {
      history.push(TX_REQUEST);
    },
  );
  await whenOnNavigatedToRoute(store, TX_REQUEST);

  return dom;
};
