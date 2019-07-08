import DownloadButton from 'medulas-react-components/lib/components/Button/Download';
import * as React from 'react';

import PDFGenerator from '../utils/pdfGenerator';

export interface Props {
  readonly mnemonic: string;
}

const PdfDownload = ({ mnemonic }: Props): JSX.Element => {
  const generatePdf = (): void => {
    const pdf = new PDFGenerator();

    pdf.createHeader([
      'Your Recovery Phrase are 12 random words that are set in a particular order that acts as a',
      'tool to recover or back up your wallet on any platform.',
      '',
      'Your recovery phrase:',
    ]);
    pdf.addMnemonicTable(mnemonic.split(' '), 45);

    pdf.save('recovery-phrase.pdf');
  };

  return <DownloadButton onDownload={generatePdf}>Export as .PDF</DownloadButton>;
};

export default PdfDownload;
