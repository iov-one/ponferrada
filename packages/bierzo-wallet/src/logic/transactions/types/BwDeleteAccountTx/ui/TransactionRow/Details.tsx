import { DeleteAccountTx } from "@iov/bns";
import { makeStyles } from "@material-ui/core";
import { Block, Typography } from "medulas-react-components";
import * as React from "react";
import { amountToString } from "ui-logic";

import { formatTime } from "../../../../../../utils/date";
import { ProcessedTx } from "../../../BwParser";

const useStyles = makeStyles({
  rowToggle: {
    cursor: "pointer",
  },
  sectionName: {
    overflowWrap: "break-word",
  },
});

interface Props {
  readonly tx: ProcessedTx<DeleteAccountTx>;
}

const TxDetails = ({ tx }: Props): JSX.Element => {
  const classes = useStyles();

  let txFee = "-";
  if (tx.original.fee && tx.original.fee.tokens) {
    txFee = "-" + amountToString(tx.original.fee.tokens);
  }

  return (
    <Block paddingLeft="56px" display="flex" flexDirection="column">
      <Block display="flex">
        <Block width="40%">
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Deleted account:
          </Typography>
          <Typography
            variant="subtitle2"
            weight="regular"
            color="textSecondary"
            className={classes.sectionName}
          >
            {tx.original.name}*{tx.original.domain}
          </Typography>
        </Block>
        <Block width="40%">
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Time:
          </Typography>
          <Typography variant="subtitle2" weight="regular" color="textSecondary">
            {formatTime(tx.time)}
          </Typography>
        </Block>
        <Block width="20%" paddingRight={3}>
          <Typography variant="subtitle2" weight="regular" align="right" gutterBottom>
            Transaction fee:
          </Typography>
          <Typography variant="subtitle2" weight="regular" color="textSecondary" align="right">
            {txFee}
          </Typography>
        </Block>
      </Block>
      <Typography>&nbsp;</Typography>
      <Block display="flex">
        <Block paddingRight={3}>
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Transaction id:
          </Typography>
          <Typography variant="subtitle2" weight="regular" color="textSecondary">
            {tx.id}
          </Typography>
        </Block>
      </Block>
    </Block>
  );
};

export default TxDetails;
