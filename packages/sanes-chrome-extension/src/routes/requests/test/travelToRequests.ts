import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { Request } from '../../../extension/background/actions/createPersona/requestHandler';
import { history } from '../../../store/reducers';
import { createDom } from '../../../utils/test/dom';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { sleep } from '../../../utils/timer';
import { REQUEST_ROUTE } from '../../paths';

export const travelToRequests = async (
  store: Store,
  requests: ReadonlyArray<Request>,
): Promise<React.Component> => {
  expect(requests.length).toBeGreaterThanOrEqual(1);

  const dom = createDom(store, requests);

  const navigate = async (): Promise<void> => {
    history.push(REQUEST_ROUTE);
    await whenOnNavigatedToRoute(store, REQUEST_ROUTE);
    await sleep(1000);
  };
  // FIXME  Once this is updated https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-dom/test-utils/index.d.ts#L296
  await TestUtils.act(navigate as any); //eslint-disable-line @typescript-eslint/no-explicit-any

  return dom;
};
