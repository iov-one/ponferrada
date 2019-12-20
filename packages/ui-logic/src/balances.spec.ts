import { Amount, Token, TokenTicker } from "@iov/bcp";

import { amountToGwei, amountToString, stringToAmount, sumToString } from "./balances";

function makeAmount(quantity: string, fractionalDigits: number, tokenTicker: TokenTicker): Amount {
  return {
    quantity,
    fractionalDigits,
    tokenTicker,
  };
}

describe("balances", () => {
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

    const iov: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
      fractionalDigits: 9,
      tokenTicker: "IOV" as TokenTicker,
    };

    it("should handle whole numbers", () => {
      expect(stringToAmount("0", eth)).toEqual(makeAmount("0", eth.fractionalDigits, eth.tokenTicker));
      expect(stringToAmount("1", eth)).toEqual(
        makeAmount("1000000000000000000", eth.fractionalDigits, eth.tokenTicker),
      );
      expect(stringToAmount("873", eth)).toEqual(
        makeAmount("873000000000000000000", eth.fractionalDigits, eth.tokenTicker),
      );

      expect(stringToAmount("0", iov)).toEqual(makeAmount("0", iov.fractionalDigits, iov.tokenTicker));
      expect(stringToAmount("1", iov)).toEqual(
        makeAmount("1000000000", iov.fractionalDigits, iov.tokenTicker),
      );
      expect(stringToAmount("873", iov)).toEqual(
        makeAmount("873000000000", iov.fractionalDigits, iov.tokenTicker),
      );
    });

    it("should handle fractional numbers with or without leading 0", () => {
      // ETH
      expect(stringToAmount("0.1234", eth)).toEqual(
        makeAmount("123400000000000000", eth.fractionalDigits, eth.tokenTicker),
      );
      expect(stringToAmount(".1234", eth)).toEqual(
        makeAmount("123400000000000000", eth.fractionalDigits, eth.tokenTicker),
      );
      expect(stringToAmount("0.170", eth)).toEqual(
        makeAmount("170000000000000000", eth.fractionalDigits, eth.tokenTicker),
      );
      expect(stringToAmount("0.0", eth)).toEqual(makeAmount("0", eth.fractionalDigits, eth.tokenTicker));
      expect(stringToAmount("0.0000", eth)).toEqual(makeAmount("0", eth.fractionalDigits, eth.tokenTicker));
      expect(stringToAmount(".0", eth)).toEqual(makeAmount("0", eth.fractionalDigits, eth.tokenTicker));

      // IOV
      expect(stringToAmount("0.1234", iov)).toEqual(
        makeAmount("123400000", iov.fractionalDigits, iov.tokenTicker),
      );
      expect(stringToAmount(".1234", iov)).toEqual(
        makeAmount("123400000", iov.fractionalDigits, iov.tokenTicker),
      );
      expect(stringToAmount("0.170", iov)).toEqual(
        makeAmount("170000000", iov.fractionalDigits, iov.tokenTicker),
      );
      expect(stringToAmount("0.0", iov)).toEqual(makeAmount("0", iov.fractionalDigits, iov.tokenTicker));
      expect(stringToAmount("0.0000", iov)).toEqual(makeAmount("0", iov.fractionalDigits, iov.tokenTicker));
      expect(stringToAmount(".0", iov)).toEqual(makeAmount("0", iov.fractionalDigits, iov.tokenTicker));
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

  describe("sumToString", () => {
    const amountA: Amount = {
      quantity: "5",
      fractionalDigits: 9,
      tokenTicker: "ETH" as TokenTicker,
    };

    const amountB: Amount = {
      quantity: "10",
      fractionalDigits: 9,
      tokenTicker: "ETH" as TokenTicker,
    };

    const amountC: Amount = {
      quantity: "10",
      fractionalDigits: 9,
      tokenTicker: "BTC" as TokenTicker,
    };

    it("correctly sums two amounts", () => {
      expect(sumToString(amountA, amountB)).toEqual("0.000000015 ETH");
    });

    it("cannot sum different tokens", () => {
      expect(() => sumToString(amountA, amountC)).toThrowError(/Cannot add amounts of different tokens/);
    });
  });
});
