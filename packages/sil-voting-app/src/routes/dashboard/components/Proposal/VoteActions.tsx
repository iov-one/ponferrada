import Button from '@material-ui/core/Button';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

interface Props {
  readonly vote: 'Invalid' | 'Yes' | 'No' | 'Abstain';
}

const VoteActions = (props: Props): JSX.Element => {
  return (
    <Block minWidth="100px" margin={2} display="flex" flexDirection="column">
      <Typography variant="body1">Your Vote:</Typography>
      <Block marginTop="4px" marginBottom="4px">
        <Button fullWidth variant={props.vote === 'Yes' ? 'contained' : 'outlined'}>
          Yes
        </Button>
      </Block>
      <Block marginTop="4px" marginBottom="4px">
        <Button fullWidth variant={props.vote === 'No' ? 'contained' : 'outlined'}>
          No
        </Button>
      </Block>
      <Block marginTop="4px" marginBottom="4px">
        <Button fullWidth variant={props.vote === 'Abstain' ? 'contained' : 'outlined'}>
          Abstain
        </Button>
      </Block>
    </Block>
  );
};

export default VoteActions;
