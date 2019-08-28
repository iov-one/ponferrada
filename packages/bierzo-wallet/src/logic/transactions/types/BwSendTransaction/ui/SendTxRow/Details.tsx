import { Address } from "@iov/bcp";
import { makeStyles } from "@material-ui/core";
import { Block, Typography } from "medulas-react-components";
import * as React from "react";

import BlockchainAddress from "../../../../../../components/BlockchainAddress";
import { ProcessedSendTransaction } from "../../../../../../store/notifications";

const useStyles = makeStyles({
  sectionName: {
    overflowWrap: "break-word",
  },
});

interface Props {
  readonly tx: ProcessedSendTransaction;
  readonly addresses: Address[];
}

const TxDetails = ({ addresses, tx }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <Block paddingLeft="56px" display="flex" flexDirection="column">
      <Block margin={2} />
      <Block display="flex">
        <Block width="65%">
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Sender:
          </Typography>
          <Typography
            variant="subtitle2"
            weight="regular"
            color="textSecondary"
            className={classes.sectionName}
          >
            {tx.original.sender}
          </Typography>
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
      <BlockchainAddress addresses={addresses} address={tx.original.recipient} />
    </Block>
  );
};

export default TxDetails;
