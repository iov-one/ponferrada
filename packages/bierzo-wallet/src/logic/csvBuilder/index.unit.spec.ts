import CsvRepresentation, { CsvRow } from "./index";

describe("Logic :: csvBuilder", () => {
  let csvBuilder: CsvRepresentation;
  const header: CsvRow = {
    id: "ID",
    recepient: "Recepient",
    sender: "Sender",
    quantity: "Quantity",
    fractionalDigits: "Fractional Digits",
    tokenTicker: "Token Ticker",
    feeQuantity: "Fee Quantity",
    feeFractionalDigits: "Fee Fractional Digits",
    feeTokenTicker: "Fee Token Ticker",
    time: "Time",
    note: "Note",
  };

  beforeEach(() => {
    csvBuilder = new CsvRepresentation(header);
  });

  it("header should contain semicolon separated string", async () => {
    expect(csvBuilder.csvHeader).toEqual(header);
  });

  it("should contain added rows", async () => {
    const data1 = {
      id: "ID-data-1",
      recepient: "Recepient-data-1",
      sender: "Sender-data-1",
      quantity: "Quantity-data-1",
      fractionalDigits: "Fractional Digits-data-1",
      tokenTicker: "Token Ticker-data-1",
      feeQuantity: "Fee Quantity-data-1",
      feeFractionalDigits: "Fee Fractional Digits-data-1",
      feeTokenTicker: "Fee Token Ticker-data-1",
      time: "Time-data-1",
      note: "Note-data-1",
    };
    csvBuilder.addRow(data1);
    const data2 = {
      id: "ID-data-2",
      recepient: "Recepient-data-2",
      sender: "Sender-data-2",
      quantity: "Quantity-data-2",
      fractionalDigits: "Fractional Digits-data-2",
      tokenTicker: "Token Ticker-data-2",
      feeQuantity: "Fee Quantity-data-2",
      feeFractionalDigits: "Fee Fractional Digits-data-2",
      feeTokenTicker: "Fee Token Ticker-data-2",
      time: "Time-data-2",
      note: "Note-data-2",
    };
    csvBuilder.addRow(data2);
    expect(csvBuilder.csvRows).toEqual([data1, data2]);
  });

  it("should return blob with proper encoding", async () => {
    const blob = csvBuilder.blob();
    expect(blob.type).toEqual("text/csv;charset=utf-8");
  });
});
