import { DownloadButton } from "medulas-react-components";
import * as React from "react";

import PDFGenerator from "../utils/pdfGenerator";

export interface Props {
  readonly mnemonic: string;
}

const PdfDownload = ({ mnemonic }: Props): JSX.Element => {
  const generatePdf = (): void => {
    const pdf = new PDFGenerator();

    pdf.createHeader([
      "Your Recovery Words are 12 random words that are set in a particular order that acts as a",
      "tool to recover or back up your wallet on any platform.",
      "",
      "Your recovery words:",
    ]);
    pdf.addMnemonicTable(mnemonic.split(" "), 45);

    pdf.save("recovery-words.pdf");
  };

  return <DownloadButton onDownload={generatePdf}>Export as .PDF</DownloadButton>;
};

export default PdfDownload;
