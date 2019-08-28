import { initialUrl, LOGIN_ROUTE, REQUEST_ROUTE, WALLET_STATUS_ROUTE, WELCOME_ROUTE } from "./paths";

describe("Paths", () => {
  describe("calculates correctly initial route", () => {
    it("goes to request view", () => {
      const personaLoaded = true;
      const hasRequests = true;
      expect(initialUrl(personaLoaded, true, hasRequests)).toBe(REQUEST_ROUTE);
      expect(initialUrl(personaLoaded, false, hasRequests)).toBe(REQUEST_ROUTE);
    });

    it("goes to account status view", () => {
      const personaLoaded = true;
      const hasRequests = false;
      expect(initialUrl(personaLoaded, true, hasRequests)).toBe(WALLET_STATUS_ROUTE);
      expect(initialUrl(personaLoaded, false, hasRequests)).toBe(WALLET_STATUS_ROUTE);
    });

    it("goes to login route", () => {
      const personaLoaded = false;
      const hasRequests = false;
      const hasPersonaStored = true;
      expect(initialUrl(personaLoaded, hasPersonaStored, hasRequests)).toBe(LOGIN_ROUTE);
      expect(initialUrl(personaLoaded, hasPersonaStored, hasRequests)).toBe(LOGIN_ROUTE);
    });

    it("goes to welcome route", () => {
      const personaLoaded = false;
      const hasRequests = false;
      const hasPersonaStored = false;
      expect(initialUrl(personaLoaded, hasPersonaStored, hasRequests)).toBe(WELCOME_ROUTE);
      expect(initialUrl(personaLoaded, hasPersonaStored, hasRequests)).toBe(WELCOME_ROUTE);
    });
  });
});
