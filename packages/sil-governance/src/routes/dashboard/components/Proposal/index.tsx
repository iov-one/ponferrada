import { Block, Hairline } from "medulas-react-components";
import React from "react";

import { SilProposal } from "../../../../store/proposals";
import CollapsingData from "./CollapsingData";
import Identification from "./Identification";
import Period from "./Period";
import TallyBar from "./TallyBar";
import Title from "./Title";
import VotingPanel from "./VotingPanel";

export interface ProposalProps extends SilProposal {
  readonly hasStarted: boolean;
}

const Proposal = ({
  id,
  action,
  title,
  author,
  description,
  startDate,
  expiryDate,
  quorum,
  threshold,
  tally,
  result,
  vote,
  hasStarted,
  hasEnded,
}: ProposalProps): JSX.Element => {
  return (
    <React.Fragment>
      <Hairline />
      <Block width="100%" display="flex" alignItems="center">
        <Block flexGrow={1} marginTop={2} marginBottom={2} marginLeft={2}>
          <Title title={title} />
          <Identification id={id} author={author} />
          <CollapsingData description={description} action={action} />
          <Block display="flex" marginTop={2}>
            <Period
              expiryDate={expiryDate}
              startDate={startDate}
              hasStarted={hasStarted}
              hasEnded={hasEnded}
            />
          </Block>
          <TallyBar tally={tally} />
        </Block>
        <VotingPanel
          result={result}
          vote={vote}
          id={id}
          quorum={quorum}
          threshold={threshold}
          tally={tally}
          hasStarted={hasStarted}
          hasEnded={hasEnded}
        />
      </Block>
    </React.Fragment>
  );
};

export default Proposal;
