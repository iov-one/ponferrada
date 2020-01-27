export const WELCOME_ROUTE = "/welcome";
export const CREATE_WALLET_ROUTE = "/create-wallet";
export const UNLOCK_ROUTE = "/unlock";
export const RESTORE_WALLET = "/restore-wallet";
export const WALLET_STATUS_ROUTE = "/wallet";
export const COLLECTIBLES_ROUTE = "/collectibles";
export const POLICY_URL = "https://www.neuma.io/policy";
export const TERMS_URL = "https://support.iov.one/hc/en-us";
export const SUPPORT_CENTER_URL = "https://support.iov.one/hc/en-us/requests/new?ticket_form_id=360000387040";

export function initialUrl(personaLoaded: boolean, hasPersonaStored: boolean): string {
  if (personaLoaded) {
    return WALLET_STATUS_ROUTE;
  }

  if (hasPersonaStored) {
    return UNLOCK_ROUTE;
  }

  return WELCOME_ROUTE;
}
