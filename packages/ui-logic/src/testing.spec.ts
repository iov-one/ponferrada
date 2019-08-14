import { whenTrue } from "./testing";

describe("testing", () => {
  describe("whenTrue", () => {
    it("resolves when callback returns true", async () => {
      await expect(whenTrue(() => true)).resolves.toBeUndefined();
      await expect(whenTrue(async () => true)).resolves.toBeUndefined();
    });

    it("resolves for callback that becomes true over time", async () => {
      const start = Date.now();
      await expect(whenTrue(() => Date.now() - start > 500)).resolves.toBeUndefined();
    });

    it("rejects if callback is not true before the timeout", async () => {
      const start = Date.now();
      await expect(whenTrue(() => Date.now() - start > 3000, 800)).rejects.toThrow(/timeout reached after/i);
    });
  });
});
