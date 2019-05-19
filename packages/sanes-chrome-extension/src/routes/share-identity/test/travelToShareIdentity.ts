import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';

import { history } from '../../../store/reducers';
import { createDom } from '../../../utils/test/dom';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { SHARE_IDENTITY } from '../../paths';

export const travelToShareIdentity = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act(
    (): void => {
      history.push(SHARE_IDENTITY);
    },
  );
  await whenOnNavigatedToRoute(store, SHARE_IDENTITY);

  return dom;
};
