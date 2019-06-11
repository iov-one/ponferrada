import { DRAWER_HTML_ID } from 'medulas-react-components/lib/components/Drawer';
import TestUtils from 'react-dom/test-utils';
import { click } from './dom';
import { findRenderedDOMComponentWithId } from './reactElemFinder';

let recoveryPhraseLink: Element;
let requestsLink: Element;

const initDrawer = async (dom: React.Component): Promise<void> => {
  const drawerButton = TestUtils.scryRenderedDOMComponentsWithTag(dom, 'button')[0];
  expect(drawerButton.getAttribute('aria-label')).toBe('Open drawer');
  click(drawerButton);

  const drawerList = await findRenderedDOMComponentWithId(dom, DRAWER_HTML_ID);
  const drawerElements = (drawerList as Element).querySelectorAll('div > div:nth-of-type(2)');
  expect(drawerElements.length).toBe(2);

  recoveryPhraseLink = drawerElements[0];
  expect(recoveryPhraseLink.textContent).toBe('Recovery words');

  requestsLink = drawerElements[1];
  expect(requestsLink.textContent).toBe('Requests');
};

export const clickRecoveryPhrase = async (dom: React.Component): Promise<void> => {
  await initDrawer(dom);
  click(recoveryPhraseLink);
};

export const clickRequests = async (dom: React.Component): Promise<void> => {
  await initDrawer(dom);
  click(requestsLink);
};
