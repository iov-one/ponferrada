import { RegisterDomainTx } from "@iov/bns";
import { makeStyles } from "@material-ui/core";
import { Block, Typography } from "medulas-react-components";
import * as React from "react";
import { amountToString } from "ui-logic";

import { formatDuration, formatTime } from "../../../../../../utils/date";
import { ProcessedTx } from "../../../../types/BwParser";

const useStyles = makeStyles({
  rowToggle: {
    cursor: "pointer",
  },
  sectionName: {
    overflowWrap: "break-word",
  },
});

interface Props {
  readonly tx: ProcessedTx<RegisterDomainTx>;
}

const TxDetails = ({ tx }: Props): React.ReactElement => {
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
            Registered starname:
          </Typography>
          <Typography
            variant="subtitle2"
            weight="regular"
            color="textSecondary"
            className={classes.sectionName}
          >
            *{tx.original.domain}
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
        <Block width="40%">
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Has Superuser:
          </Typography>
          <Typography variant="subtitle2" weight="regular" color="textSecondary">
            {tx.original.hasSuperuser ? "Yes" : "No"}
          </Typography>
        </Block>
        <Block width="40%">
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Broker:
          </Typography>
          <Typography variant="subtitle2" weight="regular" color="textSecondary">
            {tx.original.broker ? tx.original.broker : "-"}
          </Typography>
        </Block>
        <Block width="20%" paddingRight={3}>
          <Typography variant="subtitle2" weight="regular" align="right" gutterBottom>
            Account Renew:
          </Typography>
          <Typography variant="subtitle2" weight="regular" color="textSecondary" align="right">
            {formatDuration(tx.original.accountRenew)}
          </Typography>
        </Block>
      </Block>
      <Typography>&nbsp;</Typography>
      <Block display="flex">
        <Block paddingRight={3}>
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Fee:
          </Typography>
          {tx.original.msgFees.map(fee => (
            <Typography variant="subtitle2" weight="regular" color="textSecondary" gutterBottom>
              {`${fee.msgPath} (${amountToString(fee.fee)})`}
            </Typography>
          ))}
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
