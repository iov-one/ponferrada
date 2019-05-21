import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { Request } from '../../../extension/background/actions/createPersona/requestHandler';
import { history } from '../../../store/reducers';
import { createDom } from '../../../utils/test/dom';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { TX_REQUEST } from '../../paths';
import { REQUEST_FIELD } from '../../requests/components/RequestList';

export const travelToTXRequest = async (
  store: Store,
  initialRequests: ReadonlyArray<Request>,
): Promise<React.Component> => {
  expect(initialRequests.length).toBeGreaterThanOrEqual(1);

  const dom = createDom(store, initialRequests);
  TestUtils.act(
    (): void => {
      history.push({
        pathname: TX_REQUEST,
        state: {
          [REQUEST_FIELD]: initialRequests[0].id,
        },
      });
    },
  );
  await whenOnNavigatedToRoute(store, TX_REQUEST);

  return dom;
};
