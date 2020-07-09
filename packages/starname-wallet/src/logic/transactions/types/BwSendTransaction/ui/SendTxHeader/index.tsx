import { makeStyles, Theme } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Block, Hairline, Image } from "medulas-react-components";
import * as React from "react";
import { amountToString } from "ui-logic";

import { history } from "../../../../../../routes";
import { PAYMENT_ROUTE } from "../../../../../../routes/paths";
import { ProcessedSendTransaction } from "../../../../../../store/notifications";
import { itemBackground } from "../../../../../../theme/css";
import sendTx from "../../../../assets/transactionSend.svg";
import receiveTx from "../assets/transactionReceive.svg";
import Msg from "./MsgSuccess";

interface ItemProps {
  readonly item: ProcessedSendTransaction;
  readonly lastOne: boolean;
}

const onVisitSendPayment = (address: string): (() => void) => () => {
  history.push(PAYMENT_ROUTE);
  /*
    history.push({
      pathname: PAYMENT_ROUTE,
      state: {
        [RECIPIENT_FIELD]: address,
      },
    });
  */
};

const useStyles = makeStyles((theme: Theme) => ({
  msg: {
    "& > span": {
      lineHeight: 1.3,
      marginBottom: `${theme.spacing(1)}xs`,
    },
  },
  item: {
    backgroundColor: itemBackground,
  },
}));

const TxItem = ({ item, lastOne }: ItemProps): React.ReactElement => {
  const classes = useStyles();
  const { time, outgoing, original } = item;

  const beautifulAmount = amountToString(original.amount);
  const icon = outgoing ? sendTx : receiveTx;

  const msg = (
    <Msg
      onVisitSendPayment={onVisitSendPayment}
      outgoing={outgoing}
      amount={beautifulAmount}
      sender={original.sender}
      recipient={original.recipient}
    />
  );

  return (
    <Block padding={1} className={classes.item}>
      <ListItem>
        <Image src={icon} height={30} alt="Tx operation" />
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

export default TxItem;
