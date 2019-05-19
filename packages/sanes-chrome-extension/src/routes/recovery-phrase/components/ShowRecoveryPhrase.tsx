import Block from 'medulas-react-components/lib/components/Block';
import Back from 'medulas-react-components/lib/components/Button/Back';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

import PdfDownload from './PdfDownload';

export interface Props {
  readonly mnemonic: string;
  readonly onBack: () => void;
}

const ShowRecoveryPhrase = ({ onBack, mnemonic }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Block marginRight={1}>
        <Typography variant="subtitle2">
          Your Recovery Phrase are 12 random words that are set in a particular order that acts as a tool to
          recover or back up your wallet on any platform.
        </Typography>
      </Block>

      <Block display="flex" justifyContent="flex-end" marginTop={3}>
        <PdfDownload mnemonic={mnemonic} />
      </Block>

      <Block
        padding={2}
        marginTop={1}
        marginBottom={4}
        minHeight={24}
        border={1}
        borderColor="grey.300"
        borderRadius={5}
        bgcolor="grey.300"
      >
        <Typography variant="body1" inline>
          {mnemonic}
        </Typography>
      </Block>
      <Block display="flex" justifyContent="flex-start">
        <Block width={100}>
          <Back fullWidth onClick={onBack}>
            Back
          </Back>
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default ShowRecoveryPhrase;
