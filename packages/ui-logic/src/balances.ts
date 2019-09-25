import { Amount, Token } from "@iov/bcp";
import { Decimal } from "@iov/encoding";

export type Figures = Omit<Amount, "tokenTicker">;

/**
 * Parses a decimal as string into the Amount format, using the token's native fractional digits
 */
export function stringToAmount(
  amount: string,
  tokenInfo: Pick<Token, "fractionalDigits" | "tokenTicker">,
): Amount {
  return {
    quantity: Decimal.fromUserInput(amount, tokenInfo.fractionalDigits).atomics,
    fractionalDigits: tokenInfo.fractionalDigits,
    tokenTicker: tokenInfo.tokenTicker,
  };
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
