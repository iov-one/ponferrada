import { SendAction } from "@iov/bns";
import { Block, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  readonly action: SendAction;
}

const Send = ({ action }: Props): JSX.Element => {
  return (
    <Block marginTop={2} marginBottom={2}>
      <Typography variant="body2" weight="semibold">
        Transaction:
      </Typography>
      <Block marginTop={0.5}>
        <Typography variant="body2">Sender: {action.sender}</Typography>
      </Block>
      <Block marginTop={0.5}>
        <Typography variant="body2">Recipient: {action.recipient}</Typography>
      </Block>
      <Block marginTop={1}>
        <Typography variant="body2" weight="semibold">
          Amount:
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
      {action.memo && (
        <Block marginTop={1}>
          <Typography variant="body2" weight="semibold">
            Memo:
          </Typography>
          <Block marginTop={0.5}>
            <Typography variant="body2">{action.memo}</Typography>
          </Block>
        </Block>
      )}
    </Block>
  );
};

export default Send;
