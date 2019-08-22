class PDFGenerator {
  private doc: any;
  private readonly countWords: string[] = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
  ];

  public constructor() {
    // Loading the module 'jspdf' in an environment with no canvas available leads to the error message
    // > Error: Not implemented: HTMLCanvasElement.prototype.getContext
    // See also https://github.com/iov-one/ponferrada/issues/133
    // To avoid this error message to pollute test outputs, we load jspdf only when PDFGenerator is
    // constructed, not when it is imported.

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsPDF = require("jspdf");
    require("../assets/Muli-normal");
    require("../assets/Muli-bold");

    this.doc = new jsPDF();
    this.doc.setFont("Muli", "normal");
    this.doc.setFontSize(12);
  }

  public createHeader(header: string[]): void {
    this.doc.text(header, 10, 20);
  }

  public addMnemonicTable(mnemonic: string[], startLine: number): void {
    this.addMnemonicTableHeader(startLine);

    mnemonic.forEach((item: string, idx: number) => {
      const line = startLine + 8 * (idx + 1);
      this.doc.text(this.countWords[idx], 10, line);
      this.doc.text(item, 35, line);
    });
  }

  public save(filename: string): void {
    this.doc.save(filename);
  }

  private addMnemonicTableHeader(startLine: number): void {
    this.doc.setFont("Muli", "bold");
    this.doc.text("Order", 10, startLine);
    this.doc.text("Word", 35, startLine);
    this.doc.setFont("Muli", "normal");
  }
}

export default PDFGenerator;
