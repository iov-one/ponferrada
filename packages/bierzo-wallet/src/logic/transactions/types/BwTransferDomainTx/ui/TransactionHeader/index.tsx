import { TransferDomainTx } from "@iov/bns";
import { makeStyles, Theme } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Block, Hairline, Image } from "medulas-react-components";
import * as React from "react";

import { itemBackground } from "../../../../../../theme/css";
import sendTx from "../../../../assets/transactionSend.svg";
import { ProcessedTx } from "../../../BwParser";
import Msg from "./MsgSuccess";

interface ItemProps {
  readonly item: ProcessedTx<TransferDomainTx>;
  readonly lastOne: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  msg: {
    "& > span": {
      lineHeight: 1.3,
      marginBottom: `${theme.spacing(1)}px`,
    },
  },
  item: {
    backgroundColor: itemBackground,
  },
}));

const TransactionHeader = ({ item, lastOne }: ItemProps): JSX.Element => {
  const classes = useStyles();
  const { time, original } = item;

  const msg = <Msg domain={original.domain} />;

  return (
    <Block padding={1} className={classes.item}>
      <ListItem>
        <Image src={sendTx} height={30} alt="Tx operation" />
        <Block paddingLeft={2}>
          <ListItemText className={classes.msg} primary={msg} secondary={time.toLocaleString()} />
        </Block>
      </ListItem>
      {!lastOne && (
        <Block padding="md">
          <Hairline />
        </Block>
      )}
    </Block>
  );
};

export default TransactionHeader;
