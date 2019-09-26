import { round } from "./number";

describe("round", () => {
  it("rounds value to specified digits", async () => {
    expect(round(12.3456, 0)).toBe(12);
    expect(round(12.3456, 1)).toBe(12.3);
    expect(round(12.3456, 2)).toBe(12.35);
    expect(round(12.3456, 3)).toBe(12.346);
    expect(round(12.3456, 4)).toBe(12.3456);
    expect(round(12.3456, 5)).toBe(12.3456);
  });

  it("rounds value without trailing zeroes", async () => {
    expect(round(12, 2)).toBe(12);
    expect(round(12.3, 2)).toBe(12.3);
  });
});
