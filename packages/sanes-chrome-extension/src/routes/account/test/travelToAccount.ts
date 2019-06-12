import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { GetPersonaResponse } from '../../../extension/background/model/backgroundscript';
import { history } from '../../../store/reducers';
import { createDom } from '../../../utils/test/dom';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { ACCOUNT_STATUS_ROUTE } from '../../paths';

export const travelToAccount = async (
  store: Store,
  persona?: GetPersonaResponse,
): Promise<React.Component> => {
  const dom = createDom(store, [], persona);
  TestUtils.act(
    (): void => {
      history.push(ACCOUNT_STATUS_ROUTE);
    },
  );
  await whenOnNavigatedToRoute(store, ACCOUNT_STATUS_ROUTE);

  return dom;
};
