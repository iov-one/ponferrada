import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { whenOnNavigatedToRoute } from '~/utils/navigation';
import { findRenderedDOMComponentWithId } from '~/utils/test/dom';
import { MENU_ID } from '../../HiMenu/index';

export const clickMenuAndRedirect = async (
  dom: React.Component,
  menuId: string,
  route: string,
  store: Store,
) => {
  const hiMenu = findRenderedDOMComponentWithId(dom, MENU_ID);
  TestUtils.Simulate.click(hiMenu);
  const termsItem = findRenderedDOMComponentWithId(dom, menuId);
  TestUtils.Simulate.click(termsItem);
  await whenOnNavigatedToRoute(store, route);
};
