import { ProposalResult, VoteOption } from '@iov/bns';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

import { Tally } from '..';
import Buttons from './Buttons';
import ParticipationData from './ParticipationData';
import ResultFlair from './ResultFlair';

interface Props {
  readonly result: ProposalResult;
  readonly vote: VoteOption | undefined;
  readonly quorum: number;
  readonly threshold: number;
  readonly tally: Tally;
  readonly hasEnded: boolean;
}

const VotingPanel = ({ result, vote, quorum, threshold, tally, hasEnded }: Props): JSX.Element => {
  const voteLabel = hasEnded && vote && VoteOption[vote];

  return (
    <Block minWidth="160px" margin={2} display="flex" flexDirection="column">
      {hasEnded && <ResultFlair result={result} />}
      <Typography variant="body2">Your vote: {voteLabel}</Typography>
      {!hasEnded && <Buttons vote={vote} />}
      <ParticipationData quorum={quorum} threshold={threshold} tally={tally} />
    </Block>
  );
};

export default VotingPanel;
