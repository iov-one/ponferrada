/**
 * This package cause jest-canvas-mock to print message to console.error (Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package))
 *
 * But this message doesn't make test to fail so can be ignored.
 * Accroding to: https://github.com/hustcc/jest-canvas-mock/issues/2
 */
import jsPDF from 'jspdf';
import '../assets/Muli-normal';
import '../assets/Muli-bold';

class PDFGenerator {
  private doc: jsPDF;
  private readonly countWords: string[] = [
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
  ];

  public constructor() {
    this.doc = new jsPDF();
    this.doc.setFont('Muli', 'normal');
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
    this.doc.setFont('Muli', 'bold');
    this.doc.text('Order', 10, startLine);
    this.doc.text('Word', 35, startLine);
    this.doc.setFont('Muli', 'normal');
  }
}

export default PDFGenerator;
