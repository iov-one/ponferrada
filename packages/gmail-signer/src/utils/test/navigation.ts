import TestUtils from "react-dom/test-utils";
import { whenTrue } from "ui-logic";

import { GetPersonaResponse } from "../../extension/background/model/backgroundscript";
import { Request } from "../../extension/background/model/requestsHandler/requestQueueManager";
import {
  CREATE_WALLET_ROUTE,
  RESTORE_WALLET,
  UNLOCK_ROUTE,
  WALLET_STATUS_ROUTE,
  WELCOME_ROUTE,
} from "../../routes/paths";
import { history } from "../../utils/history";
import { createDom } from "../../utils/test/dom";

export const whenOnNavigatedToRoute = (desiredRoute: string): Promise<void> =>
  whenTrue(() => window.location.pathname === desiredRoute);

export const travelTo = async (
  route: string,
  requests?: readonly Request[],
  persona?: GetPersonaResponse,
  hasStoredPersona?: boolean,
): Promise<React.Component> => {
  const dom = createDom(requests, persona, hasStoredPersona);

  TestUtils.act(() => {
    history.push({
      pathname: route,
    });
  });

  await whenOnNavigatedToRoute(route);

  return dom;
};

export const travelToWelcome = async (hasStoredPersona: boolean): Promise<React.Component> => {
  return travelTo(WELCOME_ROUTE, undefined, undefined, hasStoredPersona);
};

export const travelToCreateWallet = async (): Promise<React.Component> => {
  return travelTo(CREATE_WALLET_ROUTE);
};

export const travelToUnlock = async (): Promise<React.Component> => {
  return travelTo(UNLOCK_ROUTE);
};

export const travelToRestoreWallet = async (): Promise<React.Component> => {
  return travelTo(RESTORE_WALLET);
};

export const travelToWallet = async (persona?: GetPersonaResponse): Promise<React.Component> => {
  return travelTo(WALLET_STATUS_ROUTE, [], persona);
};
