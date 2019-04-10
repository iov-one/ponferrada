import * as React from 'react';
import Typography from 'medulas-react-components/lib/components/Typography';
import PDFGenerator from '../utils/pdfGenerator';

export interface Props {
  readonly mnemonic: string;
}

const PdfDownload = ({ mnemonic }: Props): JSX.Element => {
  const generatePdf = () => {
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

  return (
    <Typography
      variant="subtitle2"
      inline
      link
      color="primary"
      onClick={generatePdf}
    >
      Get PDF
    </Typography>
  );
};

export default PdfDownload;
