export const WELCOME_ROUTE = "/welcome";
export const SIGNUP_ROUTE = "/signup";
export const LOGIN_ROUTE = "/login";
export const RECOVERY_PHRASE_ROUTE = "/recovery-phrase";
export const RESTORE_ACCOUNT = "/restore-account";
export const SHARE_IDENTITY = "/share-identity";
export const TX_REQUEST = "/tx-request";
export const ACCOUNT_STATUS_ROUTE = "/account";
export const REQUEST_ROUTE = "/requests";
export const TERMS_URL = "https://support.iov.one/hc/en-us";

export function initialUrl(personaLoaded: boolean, hasPersonaStored: boolean, hasRequests: boolean): string {
  if (personaLoaded && hasRequests) {
    return REQUEST_ROUTE;
  }

  if (personaLoaded && !hasRequests) {
    return ACCOUNT_STATUS_ROUTE;
  }

  if (hasPersonaStored) {
    return LOGIN_ROUTE;
  }

  return WELCOME_ROUTE;
}
