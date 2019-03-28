import * as React from 'react';
import Typography from 'medulas-react-components/lib/components/Typography';
import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import Switch from 'medulas-react-components/lib/components/Switch';
import Tooltip from 'medulas-react-components/lib/components/Tooltip';

const ShowPhraseForm = (): JSX.Element => {
  return (
    <React.Fragment>
      <Block display="flex" justifyContent="space-between" alignItems="center">
        <Block display="flex" alignItems="center">
          <Block marginRight={1}>
            <Typography variant="subtitle1" inline>
              Activate Backup Phrase?
            </Typography>
          </Block>
          <Tooltip>
            <Typography variant="body2">
              Your Backup Phrase are 12 random words that are set in a
              particular order that acts as a tool to recover or back up your
              wallet on any platform.
            </Typography>
          </Tooltip>
        </Block>
        <Switch color="primary" />
      </Block>

      <Block
        padding={2}
        marginTop={1}
        marginBottom={6}
        border={1}
        borderColor="grey.300"
        borderRadius={5}
        bgcolor="grey.300"
      >
        <Typography variant="body1" inline>
          organ wheat manage mirror wish truly tool trumpet since equip flight
          bracket
        </Typography>
      </Block>
      <Block display="flex" justifyContent="space-between">
        <Block width={120}>
          <Button fullWidth color="secondary">
            Back
          </Button>
        </Block>
        <Block width={120}>
          <Button fullWidth>Continue</Button>
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default ShowPhraseForm;
