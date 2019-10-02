import { Address } from "@iov/bcp";
import { Block, Typography } from "medulas-react-components";
import * as React from "react";

import BlockchainAddress from "../../../../../../components/BlockchainAddress";
import { ProcessedSendTransaction } from "../../../../../../store/notifications";

interface Props {
  readonly tx: ProcessedSendTransaction;
  readonly userAddresses: readonly Address[];
}

const TxDetails = ({ userAddresses, tx }: Props): JSX.Element => {
  return (
    <Block paddingLeft="56px" display="flex" flexDirection="column">
      <Block margin={2} />
      <Block display="flex">
        <Block width="65%">
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Sender:
          </Typography>
          <BlockchainAddress userAddresses={userAddresses} address={tx.original.sender} />
        </Block>
        <Block width="35%">
          <Block>
            <Typography variant="subtitle2" weight="regular" gutterBottom>
              Note:
            </Typography>
            <Typography variant="subtitle2" weight="regular" color="textSecondary">
              {tx.original.memo || "No note"}
            </Typography>
          </Block>
        </Block>
      </Block>
      <Typography>&nbsp;</Typography>
      <Typography variant="subtitle2" weight="regular" gutterBottom>
        Recipient:
      </Typography>
      <BlockchainAddress userAddresses={userAddresses} address={tx.original.recipient} />
    </Block>
  );
};

export default TxDetails;
