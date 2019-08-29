import { ReleaseEscrowAction } from "@iov/bns";
import { Block, Typography } from "medulas-react-components";
import React from "react";
import { amountToString } from "ui-logic";

interface Props {
  readonly action: ReleaseEscrowAction;
}

const ReleaseEscrow = ({ action }: Props): JSX.Element => {
  return (
    <Block marginTop={2} marginBottom={2}>
      <Typography variant="body2" weight="semibold">
        Release escrow {action.escrowId}:
      </Typography>
      <Block marginTop={0.5}>
        <Typography variant="body2">Amount: {amountToString(action.amount)}</Typography>
      </Block>
    </Block>
  );
};

export default ReleaseEscrow;
