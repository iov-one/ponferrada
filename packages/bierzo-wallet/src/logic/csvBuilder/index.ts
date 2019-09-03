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

class CsvRepresentation {
  private readonly header: CsvRow;
  private readonly rows: CsvRow[] = [];

  public constructor(header: CsvRow) {
    this.header = header;
  }

  public addRow(row: CsvRow): void {
    this.rows.push(row);
  }

  public get csvRows(): CsvRow[] {
    return this.rows;
  }

  public get csvHeader(): CsvRow {
    return this.header;
  }

  public blob(): Blob {
    const csvHeader = CsvRepresentation.parse(this.header);
    const csvBody = this.rows.map((row: CsvRow) => CsvRepresentation.parse(row));

    return new Blob([`${csvHeader}\n${csvBody.join("\n")}`], { type: "text/csv;charset=utf-8" });
  }

  private static parse(row: CsvRow): string {
    const parsedRow: string[] = [
      row.id,
      row.recepient,
      row.sender,
      row.quantity,
      row.fractionalDigits,
      row.tokenTicker,
      row.feeQuantity,
      row.feeFractionalDigits,
      row.feeTokenTicker,
      row.time,
      row.note,
    ].map(content => `"${content}"`);

    return parsedRow.join(";");
  }
}

export default CsvRepresentation;
