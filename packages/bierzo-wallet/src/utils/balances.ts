import { Amount, TokenTicker } from '@iov/bcp';

export type Figures = Omit<Amount, 'tokenTicker'>;

export function parseFigures(amount: string): Figures {
  // trim off all leading zeros when parsing
  const trimmed = amount.replace(/^0+/, '');
  const matched = trimmed.match(/^([0-9]+)?([.,])?([0-9]+)?$/);
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

export const makeAmount = (quantity: string, fractionalDigits: number, tokenTicker: TokenTicker): Amount => ({
  quantity,
  fractionalDigits,
  tokenTicker,
});
