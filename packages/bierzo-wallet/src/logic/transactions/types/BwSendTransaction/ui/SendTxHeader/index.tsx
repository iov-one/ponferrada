import { makeStyles, Theme } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Block from "medulas-react-components/lib/components/Block";
import Hairline from "medulas-react-components/lib/components/Hairline";
import Image from "medulas-react-components/lib/components/Image";
import * as React from "react";

import { history } from "../../../../../../routes";
import { PAYMENT_ROUTE } from "../../../../../../routes/paths";
import { ProcessedSendTransaction } from "../../../../../../store/notifications";
import { itemBackground } from "../../../../../../theme/css";
import { prettyAmount } from "../../../../../../utils/balances";
import receiveTx from "../assets/transactionReceive.svg";
import sendTx from "../assets/transactionSend.svg";
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

const TxItem = ({ item, lastOne }: ItemProps): JSX.Element => {
  const classes = useStyles();
  const { time, received, original } = item;

  const beautifulAmount = prettyAmount(original.amount);
  const icon = received ? receiveTx : sendTx;

  const msg = (
    <Msg
      onVisitSendPayment={onVisitSendPayment}
      received={received}
      amount={beautifulAmount}
      signer={original.sender}
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
