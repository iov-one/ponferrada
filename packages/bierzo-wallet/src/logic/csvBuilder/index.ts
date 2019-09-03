export interface CsvRow {
  readonly id: string;
  readonly recepient: string;
  readonly sender: string;
  readonly quantity: string;
  readonly fractionalDigits: string;
  readonly tokenTicker: string;
  readonly feeQuantity: string;
  readonly feeFractionalDigits: string;
  readonly feeTokenTicker: string;
  readonly time: string;
  readonly note: string;
}
