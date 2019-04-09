import * as React from 'react';
import jsPDF from 'jspdf';
import Typography from 'medulas-react-components/lib/components/Typography';

export interface Props {
  readonly mnemonic: string;
}

const PdfDownload = ({ mnemonic }: Props): JSX.Element => {
  const generatePdf = () => {
    const doc: jsPDF = new jsPDF();
    const mnemonicArr: Array<string> = mnemonic.split(' ');

    const headerMsg: Array<string> = [
      'Your Recovery Phrase are 12 random words that are set in a particular order',
      'that acts as a tool to recover or back up your wallet on any platform.',
      '',
      'Your recovery phrase:',
    ];

    const output = headerMsg.concat(mnemonicArr);

    doc.text(output, 10, 20);
    doc.save('recovery-phrase.pdf');
  };

  return (
    <Typography
      variant="subtitle2"
      inline
      color="primary"
      onClick={generatePdf}
    >
      Get PDF
    </Typography>
  );
};

export default PdfDownload;
