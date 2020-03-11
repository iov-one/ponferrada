import { ChainAddressPair, ReplaceAccountTargetsTx } from "@iov/bns";
import { makeStyles } from "@material-ui/core";
import { Block, Typography } from "medulas-react-components";
import * as React from "react";
import { amountToString, ellipsifyMiddle } from "ui-logic";

import { ChainAddressPairWithName } from "../../../../../../components/AddressesTable";
import { formatTime } from "../../../../../../utils/date";
import { chainAddressPairSortedMapping } from "../../../../../../utils/tokens";
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
  readonly tx: ProcessedTx<ReplaceAccountTargetsTx>;
}

const TxDetails = ({ tx }: Props): JSX.Element => {
  const classes = useStyles();
  const [addresses, setAddresses] = React.useState<readonly ChainAddressPairWithName[]>([]);

  let txFee = "-";
  if (tx.original.fee && tx.original.fee.tokens) {
    txFee = "-" + amountToString(tx.original.fee.tokens);
  }

  React.useEffect(() => {
    async function processAddresses(addresses: readonly ChainAddressPair[]): Promise<void> {
      const chainAddresses = await chainAddressPairSortedMapping(addresses);
      setAddresses(chainAddresses);
    }
    processAddresses(tx.original.newTargets);
  }, [tx.original.newTargets]);

  return (
    <Block paddingLeft="56px" display="flex" flexDirection="column">
      <Block display="flex">
        <Block width="40%">
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Registered account:
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
        <Block width="40%" paddingRight={3}>
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            Blockchain:
          </Typography>
          {addresses.map(chain => (
            <Typography variant="subtitle2" weight="regular" color="textSecondary" gutterBottom>
              {`${chain.chainName} (${ellipsifyMiddle(chain.address, 20)})`}
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
