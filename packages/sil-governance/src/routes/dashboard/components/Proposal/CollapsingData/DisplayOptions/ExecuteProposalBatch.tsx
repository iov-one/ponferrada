import { ExecuteProposalBatchAction, SendAction } from "@iov/bns";
import { Block, Typography } from "medulas-react-components";
import React from "react";
import { amountToString } from "ui-logic";

const generateListKey = (): string => Math.floor(Math.random() * new Date().getTime()).toString();

interface SendTxProps {
  readonly action: SendAction;
}

const SendTx = ({ action }: SendTxProps): JSX.Element => {
  const memoHeading = action.memo ? "Memo: " : "No memo found";

  return (
    <Block marginTop={2} marginBottom={2}>
      <Block marginTop={1}>
        <Typography variant="body2" weight="semibold">
          Transaction:
        </Typography>
      </Block>
      <Block marginTop={0.5}>
        <Typography variant="body2">From: {action.sender}</Typography>
      </Block>
      <Block marginTop={0.5}>
        <Typography variant="body2">To: {action.recipient}</Typography>
      </Block>
      <Block marginTop={0.5}>
        <Typography variant="body2">Amount: {amountToString(action.amount)}</Typography>
      </Block>
      <Block marginTop={0.5}>
        <Typography variant="body2" weight="semibold">
          {memoHeading}
        </Typography>
        {action.memo && (
          <Block marginTop={0.5}>
            <Typography variant="body2">{action.memo}</Typography>
          </Block>
        )}
      </Block>
    </Block>
  );
};

interface ExecuteProposalBatchProps {
  readonly action: ExecuteProposalBatchAction;
}

const ExecuteProposalBatch = ({ action }: ExecuteProposalBatchProps): JSX.Element => {
  const sendActions = action.messages as SendAction[];

  return (
    <React.Fragment>
      {sendActions.map(action => (
        <SendTx key={generateListKey()} action={action} />
      ))}
    </React.Fragment>
  );
};

export default ExecuteProposalBatch;
