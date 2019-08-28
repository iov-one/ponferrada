import { UpdateElectionRuleAction } from "@iov/bns";
import { Block, Typography } from "medulas-react-components";
import React from "react";
import { displayPeriod } from "ui-logic";

interface Props {
  readonly action: UpdateElectionRuleAction;
}

const UpdateElectionRule = ({ action }: Props): JSX.Element => {
  return (
    <Block marginTop={2} marginBottom={2}>
      <Typography variant="body2" weight="semibold">
        Updates committee {action.electionRuleId}:
      </Typography>
      {action.quorum && (
        <Block marginTop={0.5}>
          <Typography variant="body2">
            Quorum: {action.quorum.numerator}/{action.quorum.denominator}
          </Typography>
        </Block>
      )}
      {action.threshold && (
        <Block marginTop={0.5}>
          <Typography variant="body2">
            Threshold: {action.threshold.numerator}/{action.threshold.denominator}
          </Typography>
        </Block>
      )}
      <Block marginTop={0.5}>
        <Typography variant="body2">Period: {displayPeriod(action.votingPeriod)}</Typography>
      </Block>
    </Block>
  );
};

export default UpdateElectionRule;
