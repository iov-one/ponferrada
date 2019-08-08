import { Amount, TokenTicker } from "@iov/bcp";
import { Omit } from "react-router";

export type Figures = Omit<Amount, "tokenTicker">;

export function parseFigures(amount: string): Figures {
  // trim off all leading zeros when parsing
  const trimmed = amount.replace(/^0+/, "");
  const matched = trimmed.match(/^([0-9]+)?([.,])?([0-9]+)?$/);
  if (!matched) {
    throw new Error(`Not a valid number: ${amount}`);
  }
  // elements 1 and 3...
  const wholeString = matched[1] || "";
  // get fraction part and remove trailing zeros.
  const fractionString = (matched[3] || "").replace(/0+$/, "");
  const quantity = `${wholeString}${fractionString}`;
  const fractionalDigits = fractionString.length;

  return { quantity, fractionalDigits };
}

// This parses a decimal as string into the Amount format
export function stringToAmount(amount: string, tokenTicker: TokenTicker): Amount {
  const figures = parseFigures(amount);

  return { ...figures, tokenTicker };
}

export function amountToNumber(amount: Amount): number {
  const { quantity, fractionalDigits } = amount;
  if (!quantity.match(/^[0-9]+$/)) {
    throw new Error(`quantity must be a number, got ${quantity}`);
  }
  if (fractionalDigits < 0) {
    throw new Error(`invalid fractional digits: ${fractionalDigits}`);
  }
  // let's remove those leading zeros...
  const temp = quantity.replace(/^0+/, "");
  // unless we need them to reach a decimal point
  const pad = fractionalDigits - temp.length;
  const trimmed = pad > 0 ? "0".repeat(pad) + temp : temp;

  const cut = trimmed.length - fractionalDigits;
  const whole = cut === 0 ? "0" : trimmed.slice(0, cut);
  const decimal = fractionalDigits === 0 ? "" : `.${trimmed.slice(cut)}`;
  const value = `${whole}${decimal}`;

  return Number(value);
}

// This produces a human readable format of the amount, value and token ticker
export function amountToString(amount: Amount): string {
  const { tokenTicker } = amount;
  const value = amountToNumber(amount);

  return `${value} ${tokenTicker}`;
}

export function amountToGwei(amount: Amount): string {
  if (amount.tokenTicker !== "ETH" || amount.fractionalDigits !== 18) {
    throw new Error("This amount cannot be expressed in Gwei");
  }

  const value = amountToNumber(amount) * 10 ** 9;
  const display = Number.isInteger(value) ? value : value.toFixed(2);
  return `${display} Gwei`;
}

export function prettyAmount(amount: Amount): string {
  return amountToString(amount);
}

export const makeAmount = (quantity: string, fractionalDigits: number, tokenTicker: TokenTicker): Amount => ({
  quantity,
  fractionalDigits,
  tokenTicker,
});
