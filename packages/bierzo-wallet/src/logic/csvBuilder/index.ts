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
  [key: string]: string;
}

class CsvRepresentation {
  private readonly _fields: readonly string[];
  private readonly _header: string;
  private readonly _rows: CsvRow[] = [];

  public constructor(header: CsvRow) {
    this._fields = Object.keys(header);
    this._header = this.parse(header);
  }

  public addRow(row: CsvRow): void {
    this._rows.push(row);
  }

  public get csvRows(): CsvRow[] {
    return this._rows;
  }

  public get csvHeader(): string {
    return this._header;
  }

  public blob(): Blob {
    const csvBody = this._rows.map((row: CsvRow) => this.parse(row));

    return new Blob([`${this._header}\n${csvBody.join("\n")}`], { type: "text/plain;charset=utf-8" });
  }

  private parse(row: CsvRow): string {
    const parsedRow: string[] = [];
    this._fields.forEach(field => parsedRow.push(`"${row[field]}"`));

    return parsedRow.join(";");
  }
}

export default CsvRepresentation;
