import { ReleaseEscrowAction } from "@iov/bns";
import { Block, Typography } from "medulas-react-components";
import React from "react";

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
        <Typography variant="body2">Quantity: {action.amount.quantity}</Typography>
      </Block>
      <Block marginTop={0.5}>
        <Typography variant="body2">Fractional digits: {action.amount.fractionalDigits}</Typography>
      </Block>
      <Block marginTop={0.5}>
        <Typography variant="body2">Token ticker: {action.amount.tokenTicker}</Typography>
      </Block>
    </Block>
  );
};

export default ReleaseEscrow;
