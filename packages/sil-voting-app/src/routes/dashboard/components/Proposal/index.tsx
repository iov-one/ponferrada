import { Address } from "@iov/bcp";
import { ProposalResult, VoteOption } from "@iov/bns";
import Block from "medulas-react-components/lib/components/Block";
import React from "react";

import DeleteButton from "./DeleteButton";
import Description from "./Description";
import Identification from "./Identification";
import Period from "./Period";
import TallyBar from "./TallyBar";
import Title from "./Title";
import VotingPanel from "./VotingPanel";

export interface Tally {
  readonly yes: number;
  readonly no: number;
  readonly abstain: number;
  readonly totalVotes: number;
  readonly maxVotes: number;
}

export interface ProposalProps {
  readonly id: number;
  readonly title: string;
  readonly author: Address;
  readonly description: string;
  readonly creationDate: Date;
  readonly expiryDate: Date;
  readonly quorum: number;
  readonly threshold: number;
  readonly tally: Tally;
  readonly result: ProposalResult;
  readonly vote: VoteOption | undefined;
  readonly hasEnded: boolean;
}

const Proposal = ({
  id,
  title,
  author,
  description,
  creationDate,
  expiryDate,
  quorum,
  threshold,
  tally,
  result,
  vote,
  hasEnded,
}: ProposalProps): JSX.Element => {
  return (
    <Block width="100%" display="flex" alignItems="center">
      <Block flexGrow={1} marginTop={2} marginBottom={2} marginLeft={2}>
        <Title title={title} />
        <Identification id={id} author={author} />
        <Description description={description} />
        <Block display="flex" marginTop={2}>
          <Period expiryDate={expiryDate} creationDate={creationDate} hasEnded={hasEnded} />
          <Block marginLeft={1}>
            <DeleteButton />
          </Block>
        </Block>
        <TallyBar tally={tally} />
      </Block>
      <VotingPanel
        result={result}
        vote={vote}
        quorum={quorum}
        threshold={threshold}
        tally={tally}
        hasEnded={hasEnded}
      />
    </Block>
  );
};

export default Proposal;
