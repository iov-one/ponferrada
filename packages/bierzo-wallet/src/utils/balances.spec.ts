import { Token, TokenTicker } from "@iov/bcp";

import { amountToString, makeAmount, padAmount, parseFigures, stringToAmount } from "./balances";

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

describe("stringToAmount", () => {
  const eth: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
    fractionalDigits: 18,
    tokenTicker: "ETH" as TokenTicker,
  };

  it("should handle whole numbers", () => {
    expect(stringToAmount("2340", eth)).toEqual(makeAmount("2340", 0, eth.tokenTicker));
    expect(stringToAmount("873", eth)).toEqual(makeAmount("873", 0, eth.tokenTicker));
  });

  it("should handle fractional numbers with or without leading 0", () => {
    expect(stringToAmount("0.1234", eth)).toEqual(makeAmount("1234", 4, eth.tokenTicker));
    expect(stringToAmount(".1234", eth)).toEqual(makeAmount("1234", 4, eth.tokenTicker));
    expect(stringToAmount("0,023", eth)).toEqual(makeAmount("023", 3, eth.tokenTicker));
    expect(stringToAmount("0.170", eth)).toEqual(makeAmount("17", 2, eth.tokenTicker));
  });
});

describe("parseFigures", () => {
  it("should handle whole numbers", () => {
    expect(parseFigures("1200")).toEqual({ quantity: "1200", fractionalDigits: 0 });
    expect(parseFigures("765")).toEqual({ quantity: "765", fractionalDigits: 0 });
  });

  it("should handle fractional numbers with or without leading 0", () => {
    expect(parseFigures("0.1234")).toEqual({ quantity: "1234", fractionalDigits: 4 });
    expect(parseFigures(".1234")).toEqual({ quantity: "1234", fractionalDigits: 4 });
    expect(parseFigures("0.023")).toEqual({ quantity: "023", fractionalDigits: 3 });
  });

  it("should return number even with trailing dot or comma", () => {
    expect(parseFigures("1.")).toEqual({ quantity: "1", fractionalDigits: 0 });
    expect(parseFigures("2,")).toEqual({ quantity: "2", fractionalDigits: 0 });
  });

  it("should support , as separator", () => {
    expect(parseFigures("0,1234")).toEqual({ quantity: "1234", fractionalDigits: 4 });
    expect(parseFigures("13,67")).toEqual({ quantity: "1367", fractionalDigits: 2 });
    expect(parseFigures(",00420")).toEqual({ quantity: "0042", fractionalDigits: 4 });
  });

  it("should remove trailing zeros from fraction", () => {
    expect(parseFigures("0,1230")).toEqual({ quantity: "123", fractionalDigits: 3 });
    expect(parseFigures("13.670")).toEqual({ quantity: "1367", fractionalDigits: 2 });
    expect(parseFigures("8,675")).toEqual({ quantity: "8675", fractionalDigits: 3 });
    expect(parseFigures(".00420")).toEqual({ quantity: "0042", fractionalDigits: 4 });
  });

  it("should error on invalid strings", () => {
    expect(() => parseFigures("12a")).toThrow(/Not a valid number/);
    expect(() => parseFigures("0x1234")).toThrow(/Not a valid number/);
    expect(() => parseFigures("-15.6")).toThrow(/Not a valid number/);
  });
});

describe("padAmount", () => {
  const foo = "FOO" as TokenTicker;

  it("should expand the strings as needed", () => {
    expect(padAmount(makeAmount("12", 0, foo), 4)).toEqual(makeAmount("120000", 4, foo));
    expect(padAmount(makeAmount("1230", 2, foo), 4)).toEqual(makeAmount("123000", 4, foo));
    expect(padAmount(makeAmount("123456", 3, foo), 6)).toEqual(makeAmount("123456000", 6, foo));
    expect(padAmount(makeAmount("12003400", 6, foo), 6)).toEqual(makeAmount("12003400", 6, foo));
  });

  it("should error if not enough places", () => {
    expect(() => padAmount(makeAmount("1234", 4, foo), 2)).toThrow(/Want to pad/);
    expect(() => padAmount(makeAmount("120000", 4, foo), 3)).toThrow(/Want to pad/);
  });
});
