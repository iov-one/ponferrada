import TestUtils from "react-dom/test-utils";
import { Store } from "redux";

import { GetPersonaResponse } from "../../extension/background/model/backgroundscript";
import { Request } from "../../extension/background/model/signingServer/requestQueueManager";
import {
  ACCOUNT_STATUS_ROUTE,
  LOGIN_ROUTE,
  RECOVERY_PHRASE_ROUTE,
  REQUEST_ROUTE,
  RESTORE_ACCOUNT,
  SHARE_IDENTITY,
  SIGNUP_ROUTE,
  TX_REQUEST,
  WELCOME_ROUTE,
} from "../../routes/paths";
import { REQUEST_FIELD } from "../../routes/requests/components/RequestList";
import { history } from "../../store/reducers";
import { createDom } from "../../utils/test/dom";

const retryInterval = 400;

/**
 * Calls callback until it returns true or timeout is reachend.
 *
 * @param callback a callback function that is called in a loop. It should be cheap to execute.
 * @param timeout timeout in milliseconds. Defaults to 10 seconds
 * @returns a promise that resolves when the callback returned true and is rejected when timeout is reached.
 */
export function whenTrue(callback: () => boolean | Promise<boolean>, timeout: number = 10000): Promise<void> {
  return new Promise((resolve, reject): void => {
    const startTime = Date.now();
    const interval = setInterval(async () => {
      const runtime = Date.now() - startTime;
      if (runtime >= timeout) {
        clearInterval(interval);
        reject(`Timeout reached after ${runtime} ms`);
      } else {
        if (await callback()) {
          clearInterval(interval);
          resolve();
        }
      }
    }, retryInterval);
  });
}

export const whenOnNavigatedToRoute = (refreshStore: Store, desiredRoute: string): Promise<void> =>
  whenTrue(() => refreshStore.getState().router.location.pathname === desiredRoute);

export const travelTo = async (
  route: string,
  store: Store,
  requests?: readonly Request[],
  persona?: GetPersonaResponse,
): Promise<React.Component> => {
  const dom = createDom(store, requests, persona);

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

  await whenOnNavigatedToRoute(store, route);

  return dom;
};

export const travelToWelcome = async (store: Store): Promise<React.Component> => {
  return travelTo(WELCOME_ROUTE, store);
};

export const travelToSignup = async (store: Store): Promise<React.Component> => {
  return travelTo(SIGNUP_ROUTE, store);
};

export const travelToLogin = async (store: Store): Promise<React.Component> => {
  return travelTo(LOGIN_ROUTE, store);
};

export const travelToRecoveryPhrase = async (
  store: Store,
  persona?: GetPersonaResponse,
): Promise<React.Component> => {
  return travelTo(RECOVERY_PHRASE_ROUTE, store, [], persona);
};

export const travelToRestoreAccount = async (store: Store): Promise<React.Component> => {
  return travelTo(RESTORE_ACCOUNT, store);
};

export const travelToShareIdentity = async (
  store: Store,
  requests: readonly Request[],
): Promise<React.Component> => {
  expect(requests.length).toBeGreaterThanOrEqual(1);

  return travelTo(SHARE_IDENTITY, store, requests);
};

export const travelToTXRequest = async (
  store: Store,
  requests: readonly Request[],
): Promise<React.Component> => {
  expect(requests.length).toBeGreaterThanOrEqual(1);

  return travelTo(TX_REQUEST, store, requests);
};

export const travelToAccount = async (
  store: Store,
  persona?: GetPersonaResponse,
): Promise<React.Component> => {
  return travelTo(ACCOUNT_STATUS_ROUTE, store, [], persona);
};

export const travelToRequests = async (
  store: Store,
  requests?: readonly Request[],
): Promise<React.Component> => {
  return travelTo(REQUEST_ROUTE, store, requests);
};
