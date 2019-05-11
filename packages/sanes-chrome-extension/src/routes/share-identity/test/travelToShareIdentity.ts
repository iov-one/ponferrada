import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { SHARE_IDENTITY } from '../../paths';
import { createDom } from '../../../utils/test/dom';
import { history } from '../../../store/reducers';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';

export const travelToShareIdentity = async (store: Store): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act(
    (): void => {
      history.push(SHARE_IDENTITY);
    }
  );
  await whenOnNavigatedToRoute(store, SHARE_IDENTITY);

  return dom;
};
