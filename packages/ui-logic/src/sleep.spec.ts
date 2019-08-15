import { sleep } from "./sleep";

describe("sleep", () => {
  it("resolves after at least x milliseconds", async () => {
    for (const x of [10, 30, 120, 280]) {
      const start = Date.now();
      await sleep(x);
      const sleepingTime = Date.now() - start;
      expect(sleepingTime).toBeGreaterThanOrEqual(x);
    }
  });

  it("resolves within a reasonable amount of time >= x milliseconds", async () => {
    // Don't be too strict as jest will run many tests at the same time and test systems can be slow sometimes.
    const tolerance = 30; // ms

    for (const x of [10, 30, 120, 280]) {
      const start = Date.now();
      await sleep(x);
      const sleepingTime = Date.now() - start;
      expect(sleepingTime).toBeLessThanOrEqual(x + tolerance);
    }
  });
});
