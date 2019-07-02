import { DRAWER_HTML_ID } from 'medulas-react-components/lib/components/Drawer';
import TestUtils from 'react-dom/test-utils';
import { click } from '../../../utils/test/dom';
import { findRenderedDOMComponentWithId } from '../../../utils/test/reactElemFinder';

let recoveryPhraseLink: Element;
let requestsLink: Element;
let logoutLink: Element;
let termsLink: Element;

const initDrawer = async (drawerComponent: React.Component): Promise<void> => {
  const drawerButton = TestUtils.scryRenderedDOMComponentsWithTag(drawerComponent, 'button')[0];
  expect(drawerButton.getAttribute('aria-label')).toBe('Open drawer');
  click(drawerButton);

  const drawerList = await findRenderedDOMComponentWithId(drawerComponent, DRAWER_HTML_ID);
  const drawerElements = (drawerList as Element).querySelectorAll('div > div:nth-of-type(2)');
  expect(drawerElements.length).toBe(4);

  recoveryPhraseLink = drawerElements[0];
  expect(recoveryPhraseLink.textContent).toBe('Recovery words');

  requestsLink = drawerElements[1];
  expect(requestsLink.textContent).toBe('Requests');

  logoutLink = drawerElements[2];
  expect(logoutLink.textContent).toBe('Logout');

  termsLink = drawerElements[3];
  expect(termsLink.textContent).toBe('Terms & Conditions');
};

export const clickRecoveryPhrase = async (drawerComponent: React.Component): Promise<void> => {
  await initDrawer(drawerComponent);
  click(recoveryPhraseLink);
};

export const clickRequests = async (drawerComponent: React.Component): Promise<void> => {
  await initDrawer(drawerComponent);
  click(requestsLink);
};

export const clickLogout = async (drawerComponent: React.Component): Promise<void> => {
  await initDrawer(drawerComponent);
  click(logoutLink);
};

export const clickTerms = async (drawerComponent: React.Component): Promise<void> => {
  await initDrawer(drawerComponent);
  click(termsLink);
};
