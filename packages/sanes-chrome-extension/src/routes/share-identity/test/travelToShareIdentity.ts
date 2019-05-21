import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { Request } from '../../../extension/background/actions/createPersona/requestHandler';
import { history } from '../../../store/reducers';
import { createDom } from '../../../utils/test/dom';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { SHARE_IDENTITY } from '../../paths';
import { REQUEST_FIELD } from '../../requests/components/RequestList';

export const travelToShareIdentity = async (
  store: Store,
  initialRequests: ReadonlyArray<Request>,
): Promise<React.Component> => {
  expect(initialRequests.length).toBeGreaterThanOrEqual(1);

  const dom = createDom(store, initialRequests);
  TestUtils.act(
    (): void => {
      history.push({
        pathname: SHARE_IDENTITY,
        state: {
          [REQUEST_FIELD]: initialRequests[0].id,
        },
      });
    },
  );

  await whenOnNavigatedToRoute(store, SHARE_IDENTITY);

  return dom;
};
