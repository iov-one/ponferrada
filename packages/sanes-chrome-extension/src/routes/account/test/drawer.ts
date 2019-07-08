import { DRAWER_HTML_ID } from 'medulas-react-components/lib/components/Drawer';
import TestUtils from 'react-dom/test-utils';

import { click } from '../../../utils/test/dom';
import { findRenderedDOMComponentWithId } from '../../../utils/test/reactElemFinder';

async function openDrawer(drawerComponent: React.Component): Promise<void> {
  const drawerButton = TestUtils.scryRenderedDOMComponentsWithTag(drawerComponent, 'button')[0];
  expect(drawerButton.getAttribute('aria-label')).toBe('Open drawer');
  await click(drawerButton);
}

interface InitDrawerResult {
  readonly recoveryPhraseLink: Element;
  readonly requestsLink: Element;
  readonly logoutLink: Element;
  readonly termsLink: Element;
}

const initDrawer = async (drawerComponent: React.Component): Promise<InitDrawerResult> => {
  await openDrawer(drawerComponent);

  const drawerList = await findRenderedDOMComponentWithId(drawerComponent, DRAWER_HTML_ID);
  const drawerElements = (drawerList as Element).querySelectorAll('nav div > div:nth-of-type(2)');
  expect(drawerElements.length).toBe(3);
  const [recoveryPhraseLink, requestsLink, logoutLink] = drawerElements;
  const footerLinks = (drawerList as Element).querySelectorAll('footer a');
  expect(footerLinks.length).toBe(1);
  const [termsLink] = footerLinks;

  expect(recoveryPhraseLink.textContent).toBe('Recovery words');
  expect(requestsLink.textContent).toBe('Requests');
  expect(logoutLink.textContent).toBe('Logout');
  expect(termsLink.textContent).toBe('Terms & Conditions');

  return { recoveryPhraseLink, requestsLink, logoutLink, termsLink };
};

export const clickRecoveryPhrase = async (drawerComponent: React.Component): Promise<void> => {
  const { recoveryPhraseLink } = await initDrawer(drawerComponent);
  await click(recoveryPhraseLink);
};

export const clickRequests = async (drawerComponent: React.Component): Promise<void> => {
  const { requestsLink } = await initDrawer(drawerComponent);
  await click(requestsLink);
};

export const clickLogout = async (drawerComponent: React.Component): Promise<void> => {
  const { logoutLink } = await initDrawer(drawerComponent);
  await click(logoutLink);
};

export const clickTerms = async (drawerComponent: React.Component): Promise<void> => {
  const { termsLink } = await initDrawer(drawerComponent);
  await click(termsLink);
};
