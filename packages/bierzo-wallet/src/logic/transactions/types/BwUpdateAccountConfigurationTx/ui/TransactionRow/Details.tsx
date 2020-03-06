import { UpdateAccountConfigurationTx } from "@iov/bns";
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
  readonly tx: ProcessedTx<UpdateAccountConfigurationTx>;
}

const TxDetails = ({ tx }: Props): JSX.Element => {
  const classes = useStyles();

  let txFee = "-";
  if (tx.original.fee && tx.original.fee.tokens) {
    txFee = "-" + amountToString(tx.original.fee.tokens);
  }

  const renewDate = new Date(tx.original.configuration.domainRenew * 1000).toLocaleDateString();

  return (
    <Block paddingLeft="56px" display="flex" flexDirection="column">
      <Block display="flex">
        <Block width="40%">
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Updated account configuration:
          </Typography>
          <Typography
            variant="subtitle2"
            weight="regular"
            color="textSecondary"
            className={classes.sectionName}
          >
            {tx.original.configuration.validName}*{tx.original.configuration.validDomain}
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
            Blockchain ID:
          </Typography>
          <Typography variant="subtitle2" weight="regular" color="textSecondary" gutterBottom>
            {tx.original.configuration.validBlockchainId}
          </Typography>
        </Block>
        <Block paddingRight={3}>
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Blockchain Address:
          </Typography>
          <Typography variant="subtitle2" weight="regular" color="textSecondary" gutterBottom>
            {tx.original.configuration.validBlockchainAddress}
          </Typography>
        </Block>
      </Block>
      <Typography>&nbsp;</Typography>
      <Block display="flex">
        <Block width="40%">
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Owner:
          </Typography>
          <Typography variant="subtitle2" weight="regular" color="textSecondary" gutterBottom>
            {tx.original.configuration.owner}
          </Typography>
        </Block>
        <Block paddingRight={3}>
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Renew:
          </Typography>
          <Typography variant="subtitle2" weight="regular" color="textSecondary" gutterBottom>
            {renewDate}
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
