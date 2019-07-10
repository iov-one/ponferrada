import { makeStyles, Theme } from '@material-ui/core';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';
import { ReadonlyDate } from 'readonly-date';

import { STATUS_BACKGROUND } from '../../../../theme/css';
import { STATUS_BORDER } from '../../../../theme/css';
import { VoteResult } from '.';

const useStyles = makeStyles((theme: Theme) => ({
  status: {
    border: `1px solid ${STATUS_BORDER}`,
    borderRadius: theme.spacing(2),
  },
  winnerBar: {
    borderRadius: theme.spacing(2),
  },
}));

interface Props {
  readonly expiryDate: Date;
  readonly quorum: number;
  readonly result: VoteResult;
}

interface VoteWinner {
  readonly vote: string;
  readonly percentage: number;
}

const getTotalVotes = (result: VoteResult): number => {
  return result.yes + result.no + result.abstain;
};

const getWinner = (result: VoteResult): VoteWinner => {
  const maxVotes = Math.max(result.yes, result.no);
  let vote = 'Abstain';

  if (maxVotes === result.yes) vote = 'Yes';
  if (maxVotes === result.no) vote = 'No';
  if (maxVotes === 0) vote = 'Abstain';

  const percentage = Math.floor((maxVotes / getTotalVotes(result)) * 100);

  return { vote, percentage };
};

const StatusEnded = (props: Props): JSX.Element => {
  const classes = useStyles();

  const expiryDate = (props.expiryDate as ReadonlyDate).toLocaleString();
  const totalVotes = getTotalVotes(props.result);
  const winnerVote = getWinner(props.result).vote;
  const winnerPercentage = getWinner(props.result).percentage + '%';

  return (
    <React.Fragment>
      <Block display="flex" alignItems="center" marginBottom={1}>
        <Typography variant="body1" weight="semibold">
          Expired on {expiryDate}
        </Typography>
        <React.Fragment>
          <Block marginLeft={2}>
            <Typography variant="body1" weight="semibold">
              Quorum: {props.quorum}
            </Typography>
          </Block>
          <Block marginLeft={2}>
            <Typography variant="body1" weight="semibold">
              Total votes: {totalVotes}
            </Typography>
          </Block>
          <Block marginLeft={2}>
            <Typography variant="body1" weight="semibold">
              Result: {winnerVote}
            </Typography>
          </Block>
        </React.Fragment>
      </Block>
      <Block width="100%" className={classes.status}>
        <Block padding={1} bgcolor={STATUS_BACKGROUND} width={winnerPercentage} className={classes.winnerBar}>
          <Typography variant="body1">
            {winnerPercentage} {winnerVote}
          </Typography>
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default StatusEnded;
