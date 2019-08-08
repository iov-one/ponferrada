import { TokenTicker } from "@iov/bcp";

import { amountToGwei, amountToString, makeAmount } from "./index";

describe("amountToString", () => {
  const iov = "IOV" as TokenTicker;

  it("should handle whole numbers", () => {
    expect(amountToString(makeAmount("123", 0, iov))).toEqual("123 IOV");
    expect(amountToString(makeAmount("123000", 0, iov))).toEqual("123000 IOV");
  });

  it("should handle fractional", () => {
    expect(amountToString(makeAmount("123456", 2, iov))).toEqual("1234.56 IOV");
    expect(amountToString(makeAmount("123456", 4, iov))).toEqual("12.3456 IOV");
    expect(amountToString(makeAmount("123456", 6, iov))).toEqual("0.123456 IOV");
  });

  it("should handle odd formats", () => {
    // leading zeros
    expect(amountToString(makeAmount("00123", 2, iov))).toEqual("1.23 IOV");
    expect(amountToString(makeAmount("123456", 8, iov))).toEqual("0.00123456 IOV");
  });
});

describe("amountToGwei", () => {
  const meta = {
    fractionalDigits: 18,
    tokenTicker: "ETH" as TokenTicker,
  };

  it("works for some simple integers", () => {
    expect(amountToGwei({ ...meta, quantity: "0" })).toEqual("0 Gwei");
    expect(amountToGwei({ ...meta, quantity: "1000000000" })).toEqual("1 Gwei");
    expect(amountToGwei({ ...meta, quantity: "3000000000" })).toEqual("3 Gwei");
    expect(amountToGwei({ ...meta, quantity: "20000000000" })).toEqual("20 Gwei");
    expect(amountToGwei({ ...meta, quantity: "1304000000000" })).toEqual("1304 Gwei");
  });

  it("works for broken values", () => {
    expect(amountToGwei({ ...meta, quantity: "500000000" })).toEqual("0.50 Gwei");
    expect(amountToGwei({ ...meta, quantity: "1500000000" })).toEqual("1.50 Gwei");
    expect(amountToGwei({ ...meta, quantity: "1230000000" })).toEqual("1.23 Gwei");
  });

  it("rounds to 2 digits", () => {
    expect(amountToGwei({ ...meta, quantity: "123000000" })).toEqual("0.12 Gwei");
    expect(amountToGwei({ ...meta, quantity: "1333333333" })).toEqual("1.33 Gwei");
    expect(amountToGwei({ ...meta, quantity: "1999999999" })).toEqual("2.00 Gwei");
  });
});
