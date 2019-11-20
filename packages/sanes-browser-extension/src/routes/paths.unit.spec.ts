import { initialUrl, UNLOCK_ROUTE, WALLET_STATUS_ROUTE, WELCOME_ROUTE } from "./paths";

describe("Paths", () => {
  describe("calculates correctly initial route", () => {
    it("goes to account status view", () => {
      const personaLoaded = true;
      expect(initialUrl(personaLoaded, true)).toBe(WALLET_STATUS_ROUTE);
      expect(initialUrl(personaLoaded, false)).toBe(WALLET_STATUS_ROUTE);
    });

    it("goes to unlock route", () => {
      const personaLoaded = false;
      const hasPersonaStored = true;
      expect(initialUrl(personaLoaded, hasPersonaStored)).toBe(UNLOCK_ROUTE);
    });

    it("goes to welcome route", () => {
      const personaLoaded = false;
      const hasPersonaStored = false;
      expect(initialUrl(personaLoaded, hasPersonaStored)).toBe(WELCOME_ROUTE);
    });
  });
});
