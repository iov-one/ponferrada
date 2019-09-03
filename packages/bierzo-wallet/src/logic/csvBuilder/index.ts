import FileSaver from "file-saver";

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
  private readonly fields: readonly string[];
  private readonly header: string;
  private readonly rows: CsvRow[] = [];

  public constructor(header: CsvRow) {
    this.fields = Object.keys(header);
    this.header = this.parse(header);
  }

  public addRow(row: CsvRow): void {
    this.rows.push(row);
  }

  public get(): Blob {
    const csvBody = this.rows.map((row: CsvRow) => this.parse(row));

    return new Blob([`${this.header}\n${csvBody.join("\n")}`], { type: "text/plain;charset=utf-8" });
  }

  private parse(row: CsvRow): string {
    const parsedRow: string[] = [];
    this.fields.forEach(field => parsedRow.push(`"${row[field]}"`));

    return parsedRow.join(";");
  }
}

export default CsvRepresentation;
