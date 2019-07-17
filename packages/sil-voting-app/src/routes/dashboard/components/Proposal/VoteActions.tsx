import Button from '@material-ui/core/Button';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

interface Props {
  readonly vote: 'Invalid' | 'Yes' | 'No' | 'Abstain';
}

const VoteActions = ({ vote }: Props): JSX.Element => {
  const yesButton = vote === 'Yes' ? 'contained' : 'outlined';
  const noButton = vote === 'No' ? 'contained' : 'outlined';
  const abstainButton = vote === 'Abstain' ? 'contained' : 'outlined';

  return (
    <Block minWidth="100px" margin={2} display="flex" flexDirection="column">
      <Typography variant="body1">Your Vote:</Typography>
      <Block marginTop={0.5} marginBottom={0.5}>
        <Button fullWidth variant={yesButton}>
          Yes
        </Button>
      </Block>
      <Block marginTop={0.5} marginBottom={0.5}>
        <Button fullWidth variant={noButton}>
          No
        </Button>
      </Block>
      <Block marginTop={0.5} marginBottom={0.5}>
        <Button fullWidth variant={abstainButton}>
          Abstain
        </Button>
      </Block>
    </Block>
  );
};

export default VoteActions;
