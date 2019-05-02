import { Amount, TokenTicker } from '@iov/bcp';
import { Omit } from 'react-router';

export type Figures = Omit<Amount, 'tokenTicker'>;

export function parseFigures(amount: string): Figures {
  // trim off all leading zeros when parsing
  const trimmed = amount.replace(/^0+/, '');
  const matched = trimmed.match(/^([0-9]+)?([\.\,])?([0-9]+)?$/);
  if (!matched) {
    throw new Error(`Not a valid number: ${amount}`);
  }
  // elements 1 and 3...
  const wholeString = matched[1] || '';
  // get fraction part and remove trailing zeros.
  const fractionString = (matched[3] || '').replace(/0+$/, '');
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
  const temp = quantity.replace(/^0+/, '');
  // unless we need them to reach a decimal point
  const pad = fractionalDigits - temp.length;
  const trimmed = pad > 0 ? '0'.repeat(pad) + temp : temp;

  const cut = trimmed.length - fractionalDigits;
  const whole = cut === 0 ? '0' : trimmed.slice(0, cut);
  const decimal = fractionalDigits === 0 ? '' : `.${trimmed.slice(cut)}`;
  const value = `${whole}${decimal}`;

  return Number(value);
}

// This produces a human readable format of the amount, value and token ticker
export function amountToString(amount: Amount): string {
  const { tokenTicker } = amount;
  const value = amountToNumber(amount);

  return `${value} ${tokenTicker}`;
}

// this takes an amount and trims off all trailing 0s
// TODO: remove leading 0s also
export function trimAmount(amount: Amount): Amount {
  const { quantity, fractionalDigits, tokenTicker } = amount;
  const trailingZerosMatch = quantity.match(/[^0](0*)$/);
  const numberOfTrailingZeros = trailingZerosMatch ? trailingZerosMatch[1].length : 0;
  const cut = Math.min(numberOfTrailingZeros, fractionalDigits);
  if (cut === 0) {
    return amount;
  }
  const trimmedQuantity = quantity.slice(0, -cut);
  const trimmedDigits = fractionalDigits - cut;
  return {
    quantity: trimmedQuantity,
    fractionalDigits: trimmedDigits,
    tokenTicker,
  };
}

// this takes an amount and pad 0s to the desired fractionalDigits, or throws error if fractionalDigits is already larger
export function padAmount(amount: Amount, desiredDigits: number): Amount {
  const { quantity, fractionalDigits, tokenTicker } = amount;
  const diff = desiredDigits - fractionalDigits;
  if (diff < 0) {
    throw new Error(`Want to pad to ${desiredDigits}, but already has ${fractionalDigits}`);
  } else if (diff === 0) {
    return amount;
  } else {
    const newQuantity = quantity + '0'.repeat(diff);
    return {
      quantity: newQuantity,
      fractionalDigits: desiredDigits,
      tokenTicker,
    };
  }
}

// compareAmount returns 1 is a is bigger, -1 if b is bigger, 0 is the same value
// it throws an error if they have different tickers
export function compareAmounts(a: Amount, b: Amount): number {
  if (a.tokenTicker !== b.tokenTicker) {
    throw new Error(`Cannot compare ${a.tokenTicker} with ${b.tokenTicker}`);
  }
  // same number of fractional digits
  const maxDigits = Math.max(a.fractionalDigits, b.fractionalDigits);
  const { quantity: first } = padAmount(trimAmount(a), maxDigits);
  const { quantity: second } = padAmount(trimAmount(b), maxDigits);

  // longer number is bigger
  if (first.length > second.length) {
    return 1;
  } else if (first.length < second.length) {
    return -1;
  } else if (first === second) {
    // string compare if same length
    return 0;
  } else if (first > second) {
    return 1;
  } else {
    return -1;
  }
}

export function prettyAmount(amount: Amount): string {
  return amountToString(trimAmount(amount));
}

export const makeAmount = (quantity: string, fractionalDigits: number, tokenTicker: TokenTicker): Amount => ({
  quantity,
  fractionalDigits,
  tokenTicker,
});
