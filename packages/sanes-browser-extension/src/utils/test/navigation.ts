import TestUtils from "react-dom/test-utils";
import { whenTrue } from "ui-logic";

import { GetPersonaResponse } from "../../extension/background/model/backgroundscript";
import { Request } from "../../extension/background/model/requestsHandler/requestQueueManager";
import {
  RECOVERY_PHRASE_ROUTE,
  REQUEST_ROUTE,
  RESTORE_WALLET,
  SHARE_IDENTITY,
  SIGNUP_ROUTE,
  TX_REQUEST,
  UNLOCK_ROUTE,
  WALLET_STATUS_ROUTE,
  WELCOME_ROUTE,
} from "../../routes/paths";
import { REQUEST_FIELD } from "../../routes/requests/components/RequestList";
import { history } from "../../utils/history";
import { createDom } from "../../utils/test/dom";

export const whenOnNavigatedToRoute = (desiredRoute: string): Promise<void> =>
  whenTrue(() => window.location.pathname === desiredRoute);

export const travelTo = async (
  route: string,
  requests?: readonly Request[],
  persona?: GetPersonaResponse,
): Promise<React.Component> => {
  const dom = createDom(requests, persona);

  TestUtils.act(() => {
    history.push({
      pathname: route,
      state:
        requests && requests.length > 0
          ? {
              [REQUEST_FIELD]: requests[0].id,
            }
          : null,
    });
  });

  await whenOnNavigatedToRoute(route);

  return dom;
};

export const travelToWelcome = async (): Promise<React.Component> => {
  return travelTo(WELCOME_ROUTE);
};

export const travelToSignup = async (): Promise<React.Component> => {
  return travelTo(SIGNUP_ROUTE);
};

export const travelToUnlock = async (): Promise<React.Component> => {
  return travelTo(UNLOCK_ROUTE);
};

export const travelToRecoveryPhrase = async (persona?: GetPersonaResponse): Promise<React.Component> => {
  return travelTo(RECOVERY_PHRASE_ROUTE, [], persona);
};

export const travelToRestoreWallet = async (): Promise<React.Component> => {
  return travelTo(RESTORE_WALLET);
};

export const travelToShareIdentity = async (requests: readonly Request[]): Promise<React.Component> => {
  expect(requests.length).toBeGreaterThanOrEqual(1);

  return travelTo(SHARE_IDENTITY, requests);
};

export const travelToTXRequest = async (requests: readonly Request[]): Promise<React.Component> => {
  expect(requests.length).toBeGreaterThanOrEqual(1);

  return travelTo(TX_REQUEST, requests);
};

export const travelToWallet = async (persona?: GetPersonaResponse): Promise<React.Component> => {
  return travelTo(WALLET_STATUS_ROUTE, [], persona);
};

export const travelToRequests = async (requests?: readonly Request[]): Promise<React.Component> => {
  return travelTo(REQUEST_ROUTE, requests);
};
