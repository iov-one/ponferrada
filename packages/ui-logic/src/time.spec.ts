import { displayPeriod } from "./time";

describe("displayPeriod", () => {
  it("correctly displays seconds", () => {
    expect(displayPeriod(1)).toBe("1s");
    expect(displayPeriod(59)).toBe("59s");
  });

  it("correctly displays minutes", () => {
    expect(displayPeriod(60)).toBe("1m");
    expect(displayPeriod(3540)).toBe("59m");
  });

  it("correctly displays hours", () => {
    expect(displayPeriod(3600)).toBe("1h");
    expect(displayPeriod(24 * 3600 - 60)).toBe("23h 59m");
  });

  it("correctly displays days", () => {
    expect(displayPeriod(24 * 3600)).toBe("1d");
  });

  it("correctly displays period with several units", () => {
    expect(displayPeriod(61)).toBe("1m 1s");
    expect(displayPeriod(3601)).toBe("1h 1s");
    expect(displayPeriod(24 * 3600 + 1)).toBe("1d 1s");

    expect(displayPeriod(3660)).toBe("1h 1m");
    expect(displayPeriod(24 * 3600 + 60)).toBe("1d 1m");

    expect(displayPeriod(24 * 3600 + 3600)).toBe("1d 1h");

    expect(displayPeriod(3661)).toBe("1h 1m 1s");
    expect(displayPeriod(24 * 3600 + 61)).toBe("1d 1m 1s");
    expect(displayPeriod(24 * 3600 + 3601)).toBe("1d 1h 1s");
    expect(displayPeriod(24 * 3600 + 3660)).toBe("1d 1h 1m");

    expect(displayPeriod(24 * 3600 + 3661)).toBe("1d 1h 1m 1s");
  });
});
