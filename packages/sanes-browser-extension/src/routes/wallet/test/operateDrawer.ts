import TestUtils from "react-dom/test-utils";

import { click } from "../../../utils/test/dom";
import { findRenderedDOMComponentWithId } from "../../../utils/test/reactElemFinder";
import { WELCOME_ROUTE } from "../../paths";
import { Views } from "../components/SidePanel/PanelDrawer";
import { logoutText } from "../components/SidePanel/PanelDrawer/components/Menu";

interface DrawerMenuResult {
  readonly requestsLink: Element;
  readonly settingsLink: Element;
  readonly logOutLink: Element;
}

interface DrawerSettingsResult {
  readonly networksLink: Element;
  readonly aboutLink: Element;
  readonly recoveryWordsLink: Element;
  readonly deleteWalletLink: Element;
}

async function openDrawer(drawerComponent: React.Component): Promise<void> {
  const buttons = TestUtils.scryRenderedDOMComponentsWithTag(drawerComponent, "button");
  const openDrawerButton = buttons.find(button => button.getAttribute("aria-label") === "Open drawer");

  if (!openDrawerButton) throw Error("Open drawer button not found");

  await click(openDrawerButton);
}

export const goToMenu = async (drawerComponent: React.Component): Promise<DrawerMenuResult> => {
  await openDrawer(drawerComponent);
  const menuHeader = (await findRenderedDOMComponentWithId(drawerComponent, Views.Menu)) as Element;
  const menu = menuHeader.nextElementSibling;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const menuLinks = menu!.querySelectorAll("nav > div");
  expect(menuLinks.length).toBe(4);

  const [requestsLink, settingsLink, logOutLink] = menuLinks;
  expect(requestsLink.textContent).toBe(Views.Requests);
  expect(settingsLink.textContent).toBe(Views.Settings);
  expect(logOutLink.textContent).toBe(logoutText);

  return { requestsLink, settingsLink, logOutLink };
};

export const goToRequests = async (drawerComponent: React.Component): Promise<void> => {
  const { requestsLink } = await goToMenu(drawerComponent);
  await click(requestsLink);
  await findRenderedDOMComponentWithId(drawerComponent, Views.Requests);
};

export const goToSettings = async (drawerComponent: React.Component): Promise<DrawerSettingsResult> => {
  const { settingsLink } = await goToMenu(drawerComponent);
  await click(settingsLink);
  const settingsHeader = (await findRenderedDOMComponentWithId(drawerComponent, Views.Settings)) as Element;
  const settings = settingsHeader.nextElementSibling;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const settingsLinks = settings!.querySelectorAll("nav > div");
  expect(settingsLinks.length).toBe(4);

  const [networksLink, aboutLink, recoveryWordsLink, deleteWalletLink] = settingsLinks;
  expect(networksLink.textContent).toBe(Views.Networks);
  expect(aboutLink.textContent).toBe(Views.About);
  expect(recoveryWordsLink.textContent).toBe(Views.RecoveryWords);
  expect(deleteWalletLink.textContent).toBe(Views.DeleteWallet);

  return { networksLink, aboutLink, recoveryWordsLink, deleteWalletLink };
};

export const logOut = async (drawerComponent: React.Component): Promise<void> => {
  const { logOutLink } = await goToMenu(drawerComponent);
  await click(logOutLink);
  await findRenderedDOMComponentWithId(drawerComponent, WELCOME_ROUTE);
};

export const goToNetworks = async (drawerComponent: React.Component): Promise<void> => {
  const { networksLink } = await goToSettings(drawerComponent);
  await click(networksLink);
  await findRenderedDOMComponentWithId(drawerComponent, Views.Networks);
};

export const goToAbout = async (drawerComponent: React.Component): Promise<void> => {
  const { aboutLink } = await goToSettings(drawerComponent);
  await click(aboutLink);
  await findRenderedDOMComponentWithId(drawerComponent, Views.About);
};

export const goToRecoveryWords = async (drawerComponent: React.Component): Promise<void> => {
  const { recoveryWordsLink } = await goToSettings(drawerComponent);
  await click(recoveryWordsLink);
  await findRenderedDOMComponentWithId(drawerComponent, Views.RecoveryWords);
};

export const goToDeleteWallet = async (drawerComponent: React.Component): Promise<void> => {
  const { deleteWalletLink } = await goToSettings(drawerComponent);
  await click(deleteWalletLink);
  await findRenderedDOMComponentWithId(drawerComponent, Views.DeleteWallet);
};
