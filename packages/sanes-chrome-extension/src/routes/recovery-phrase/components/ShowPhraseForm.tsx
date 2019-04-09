import * as React from 'react';
import Typography from 'medulas-react-components/lib/components/Typography';
import Block from 'medulas-react-components/lib/components/Block';
import Back from 'medulas-react-components/lib/components/Button/Back';

export interface Props {
  readonly mnemonic: string;
  readonly onBack: () => void;
}

const ShowPhraseForm = ({ onBack, mnemonic }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Block display="flex" justifyContent="space-between" alignItems="center">
        <Block display="flex" alignItems="center">
          <Block marginRight={1}>
            <Typography variant="subtitle2" inline>
              Your Recovery Phrase are 12 random words that are set in a
              particular order that acts as a tool to recover or back up your
              wallet on any platform.
            </Typography>
          </Block>
        </Block>
      </Block>

      <Block
        padding={2}
        marginTop={3}
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
      <Block display="flex" justifyContent="space-between">
        <Block width={120}>
          <Back fullWidth onClick={onBack}>
            Back
          </Back>
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default ShowPhraseForm;
