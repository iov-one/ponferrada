import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { WELCOME_ROUTE } from '../paths';
import { history, RootState } from '../../store/reducers';
import { createDom } from '../../utils/test/dom';
import { aNewStore } from '../../store';
import { whenOnNavigatedToRoute } from '../../utils/test/navigation';
import { sleep } from '../../utils/timer';

describe('DOM > Feature > Welcome', (): void => {
  let store: Store<RootState>;
  let dom: React.Component;

  beforeEach(
    async (): Promise<void> => {
      store = aNewStore();
      dom = createDom(store);
      TestUtils.act(
        (): void => {
          history.push(WELCOME_ROUTE);
        }
      );
      await sleep(500);
    }
  );

  it(`should create Welcome layout view`, async (): Promise<void> => {
    await whenOnNavigatedToRoute(store, WELCOME_ROUTE);
  }, 55000);

  it(`should create three buttons`, async (): Promise<void> => {
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(dom, 'button');

    expect(buttons.length).toBe(3);
  }, 55000);
});
