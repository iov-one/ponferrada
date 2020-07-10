/**
 * This produces a human readable format of the amount, value and token ticker
 */
export declare function amountToString(amount: Amount): string;
/**
 * Parses a decimal as string into the Amount format, using the token's native fractional digits
 */
export declare function stringToAmount(
  amount: string,
  tokenInfo: Pick<Token, "fractionalDigits" | "tokenTicker">,
): Amount;
/**
 * Converts an amount to a JavaScript number. Please note that the resulting value is
 * an approximation only since not all amounts can accurately be expressed as floats.
 */
export declare function amountToNumber(amount: Amount): number;
export declare function amountToGwei(amount: Amount): string;
export declare function sumAmounts(amountA: Amount, amountB: Amount): Amount;
