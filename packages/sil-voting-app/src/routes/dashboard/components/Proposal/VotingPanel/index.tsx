import { ProposalResult, VoteOption } from "@iov/bns";
import { Block, Typography } from "medulas-react-components";
import React from "react";

import { Tally } from "..";
import Buttons from "./Buttons";
import ParticipationData from "./ParticipationData";
import ResultFlair from "./ResultFlair";

interface Props {
  readonly result: ProposalResult;
  readonly vote: VoteOption | undefined;
  readonly id: number;
  readonly quorum: number;
  readonly threshold: number;
  readonly tally: Tally;
  readonly hasEnded: boolean;
}

const VotingPanel = ({ result, vote, id, quorum, threshold, tally, hasEnded }: Props): JSX.Element => {
  const voteLabel = hasEnded && vote && VoteOption[vote];

  return (
    <Block minWidth="160px" margin={2} display="flex" flexDirection="column">
      {hasEnded && <ResultFlair result={result} />}
      <Typography variant="body2">Your vote: {voteLabel}</Typography>
      {!hasEnded && <Buttons id={id} vote={vote} />}
      <ParticipationData quorum={quorum} threshold={threshold} tally={tally} />
    </Block>
  );
};

export default VotingPanel;
