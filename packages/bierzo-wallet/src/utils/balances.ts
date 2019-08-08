import { Amount, Token, TokenTicker } from "@iov/bcp";

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

/**
 * Parses a decimal as string into the Amount format, using the token's native fractional digits
 */
export function stringToAmount(
  amount: string,
  tokenInfo: Pick<Token, "fractionalDigits" | "tokenTicker">,
): Amount {
  const figures = parseFigures(amount);

  const tmp = {
    ...figures,
    tokenTicker: tokenInfo.tokenTicker,
  };

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return padAmount(tmp, tokenInfo.fractionalDigits);
}

export const makeAmount = (quantity: string, fractionalDigits: number, tokenTicker: TokenTicker): Amount => ({
  quantity,
  fractionalDigits,
  tokenTicker,
});

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

// this takes an amount and pad 0s to the desired fractionalDigits, or throws error if fractionalDigits is already larger
function padAmount(amount: Amount, desiredDigits: number): Amount {
  const { quantity, fractionalDigits, tokenTicker } = amount;
  const diff = desiredDigits - fractionalDigits;
  if (diff < 0) {
    throw new Error(`Want to pad to ${desiredDigits}, but already has ${fractionalDigits}`);
  }

  const newQuantity = quantity + "0".repeat(diff);
  const trimmedQuantity = newQuantity.replace(/^0*/, "") || "0";
  return {
    quantity: trimmedQuantity,
    fractionalDigits: desiredDigits,
    tokenTicker,
  };
}

// This produces a human readable format of the amount, value and token ticker
export function amountToString(amount: Amount): string {
  const { tokenTicker } = amount;
  const value = amountToNumber(amount);

  return `${value} ${tokenTicker}`;
}

export function prettyAmount(amount: Amount): string {
  return amountToString(amount);
}
