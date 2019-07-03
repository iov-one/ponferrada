import Button from '@material-ui/core/Button';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';
import { elipsify } from '../../../../utils/strings';
import Description from './Description';
import Status from './Status';

const TITLE_MAX_LENGTH = 30;

export interface VoteResult {
  readonly yes: number;
  readonly no: number;
  readonly abstain: number;
}

export interface ProposalProps {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly description: string;
  readonly creationDate: Date;
  readonly expiryDate: Date;
  readonly quorum: number;
  readonly threshold: number;
  readonly result: VoteResult;
  readonly vote: 'Invalid' | 'Yes' | 'No' | 'Abstain';
  readonly status: 'Active' | 'Submitted' | 'Ended';
}

const Proposal = (props: ProposalProps): JSX.Element => {
  return (
    <Block width="100%" display="flex" alignItems="center">
      <Block flexGrow={1} margin={2}>
        <Block display="flex" alignItems="center">
          <Typography variant="h6">{elipsify(props.title, TITLE_MAX_LENGTH)}</Typography>
          <Block marginLeft={2}>
            <Typography variant="body1">{props.status}</Typography>
          </Block>
        </Block>
        <Block display="flex" alignItems="center">
          <Typography variant="body1">Author: {props.author}</Typography>
          <Block marginLeft={2}>
            <Typography variant="body1">Proposal ID: {props.id}</Typography>
          </Block>
          <Block marginLeft={2}>
            <Typography variant="body1">
              Created on {props.creationDate.toLocaleDateString('es-ES')}
            </Typography>
          </Block>
        </Block>
        <Description description={props.description} />
        <Status
          expiryDate={props.expiryDate}
          quorum={props.quorum}
          result={props.result}
          status={props.status}
        />
      </Block>
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
    </Block>
  );
};

export default Proposal;
