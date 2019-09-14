export const WELCOME_ROUTE = "/welcome";
export const CREATE_WALLET_ROUTE = "/create-wallet";
export const UNLOCK_ROUTE = "/unlock";
export const DELETE_WALLET_ROUTE = "/delete-wallet";
export const RECOVERY_PHRASE_ROUTE = "/recovery-phrase";
export const RESTORE_WALLET = "/restore-wallet";
export const SHARE_IDENTITY = "/share-identity";
export const TX_REQUEST = "/tx-request";
export const WALLET_STATUS_ROUTE = "/wallet";
export const REQUEST_ROUTE = "/requests";
export const TERMS_URL = "https://support.iov.one/hc/en-us";

export function initialUrl(personaLoaded: boolean, hasPersonaStored: boolean, hasRequests: boolean): string {
  if (personaLoaded && hasRequests) {
    return REQUEST_ROUTE;
  }

  if (personaLoaded && !hasRequests) {
    return WALLET_STATUS_ROUTE;
  }

  if (hasPersonaStored) {
    return UNLOCK_ROUTE;
  }

  return WELCOME_ROUTE;
}
