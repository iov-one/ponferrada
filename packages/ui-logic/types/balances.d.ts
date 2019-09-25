import { Amount, Token } from "@iov/bcp";
export declare type Figures = Omit<Amount, "tokenTicker">;
/**
 * Parses a decimal as string into the Amount format, using the token's native fractional digits
 */
export declare function stringToAmount(
  amount: string,
  tokenInfo: Pick<Token, "fractionalDigits" | "tokenTicker">,
): Amount;
export declare function amountToNumber(amount: Amount): number;
export declare function amountToString(amount: Amount): string;
export declare function amountToGwei(amount: Amount): string;
