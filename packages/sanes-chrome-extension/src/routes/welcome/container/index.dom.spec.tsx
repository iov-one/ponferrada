import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { WELCOME_ROUTE } from '../../paths';
import { history, RootState } from '../../../store/reducers';
import { createDom } from '../../../utils/test/dom';
import { aNewStore } from '../../../store';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import Button from 'medulas-react-components/lib/components/Button';

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

describe('DOM > Feature > Welcome', () => {
  let store: Store<RootState>;
  let dom: React.Component;

  beforeEach(async () => {
    store = aNewStore();
    dom = createDom(store);
    TestUtils.act(() => {
      history.push(WELCOME_ROUTE);
    });
    await sleep(500);
  });

  it(`should create Welcome layout view`, async () => {
    await whenOnNavigatedToRoute(store, WELCOME_ROUTE);
  }, 55000);

  it(`should create three buttons`, async () => {
    const buttons = TestUtils.scryRenderedDOMComponentsWithClass(
      dom,
      'welcome-view-buttons'
    );

    expect(buttons.length).toBe(3);
  }, 55000);
});
