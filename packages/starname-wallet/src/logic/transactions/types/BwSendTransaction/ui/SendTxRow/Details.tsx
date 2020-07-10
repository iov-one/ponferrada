import { Address } from "@iov/bcp";
import { Block, Typography } from "medulas-react-components";
import * as React from "react";
import { amountToString } from "ui-logic";

import BlockchainAddress from "../../../../../../components/BlockchainAddress";
import { ProcessedSendTransaction } from "../../../../../../store/notifications";
import { formatTime } from "../../../../../../utils/date";

interface Props {
  readonly tx: ProcessedSendTransaction;
  readonly userAddresses: readonly Address[];
}

const TxDetails = ({ userAddresses, tx }: Props): React.ReactElement => {
  let txFee = "-";
  const amount = tx.original.fee?.tokens || tx.original.fee?.gasPrice;
  if (amount) {
    txFee = amountToString(amount);
    if (tx.outgoing) txFee = "-" + txFee;
  }

  return (
    <Block paddingLeft="56px" display="flex" flexDirection="column">
      <Block display="flex">
        <Block width="60%">
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Sender:
          </Typography>
          <BlockchainAddress userAddresses={userAddresses} address={tx.original.sender} />
        </Block>
        <Block width="20%">
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Time:
          </Typography>
          <Typography variant="subtitle2" weight="regular" color="textSecondary">
            {formatTime(tx.time)}
          </Typography>
        </Block>
        {tx.outgoing && (
          <Block width="20%" paddingRight={3}>
            <Typography variant="subtitle2" weight="regular" align="right" gutterBottom>
              Transaction fee:
            </Typography>
            <Typography variant="subtitle2" weight="regular" color="textSecondary" align="right">
              {txFee}
            </Typography>
          </Block>
        )}
      </Block>
      <Typography>&nbsp;</Typography>
      <Block>
        <Typography variant="subtitle2" weight="regular" gutterBottom>
          Recipient:
        </Typography>
        <BlockchainAddress userAddresses={userAddresses} address={tx.original.recipient} />
      </Block>
      <Typography>&nbsp;</Typography>
      <Block>
        <Typography variant="subtitle2" weight="regular" gutterBottom>
          Transaction id:
        </Typography>
        <Typography variant="subtitle2" weight="regular" color="textSecondary">
          {tx.id}
        </Typography>
      </Block>
      <Typography>&nbsp;</Typography>
      <Block width="100%">
        <Typography variant="subtitle2" weight="regular" gutterBottom>
          Note:
        </Typography>
        <Typography variant="subtitle2" weight="regular" color="textSecondary">
          {tx.original.memo || "No note"}
        </Typography>
      </Block>
    </Block>
  );
};

export default TxDetails;
