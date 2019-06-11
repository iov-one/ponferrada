import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import errorTx from '~/components/Header/assets/transactionError.svg';
import receiveTx from '~/components/Header/assets/transactionReceive.svg';
import sendTx from '~/components/Header/assets/transactionSend.svg';
import Block from '~/components/layout/Block';
import Hairline from '~/components/layout/Hairline';
import Img from '~/components/layout/Image';
import { prettyAmount } from '~/logic';
import { PAYMENT_ROUTE } from '~/routes';
import { RECIPIENT_FIELD } from '~/routes/sendPayment/components/FillPayment/RecipientCard';
import { history } from '~/store';
import { ProcessedTx } from '~/store/notifications/state';
import { itemBackground, xs } from '~/theme/variables';
import MsgError from './MsgError';
import Msg from './MsgSuccess';

interface ItemProps extends WithStyles<typeof styles> {
  readonly item: ProcessedTx;
  readonly phone: boolean;
  readonly lastOne: boolean;
}

const onVisitSendPayment = (address: string) => () => {
  history.push({
    pathname: PAYMENT_ROUTE,
    state: {
      [RECIPIENT_FIELD]: address,
    },
  });
};

const styles = createStyles({
  msg: {
    '& > span': {
      lineHeight: 1.3,
      marginBottom: xs,
    },
  },
  item: {
    backgroundColor: itemBackground,
  },
});

const TxItem = ({ item, phone, classes, lastOne }: ItemProps) => {
  const { time, amount, received, signer, recipient, success } = item;

  const beautifulAmount = prettyAmount(amount);
  const icon = success ? (received ? receiveTx : sendTx) : errorTx;

  const msg = success ? (
    <Msg
      onVisitSendPayment={onVisitSendPayment}
      received={received}
      amount={beautifulAmount}
      signer={signer}
      recipient={recipient}
    />
  ) : (
    <MsgError onVisitSendPayment={onVisitSendPayment} amount={beautifulAmount} recipient={recipient} />
  );

  return (
    <Block padding={phone ? 'sm' : undefined} className={classes.item}>
      <ListItem>
        <Img src={icon} height={32} alt="Tx operation" />
        <ListItemText className={classes.msg} primary={msg} secondary={time.toLocaleString()} />
      </ListItem>
      {!lastOne && (
        <Block padding="md">
          <Hairline />
        </Block>
      )}
    </Block>
  );
};

export default withStyles(styles)(TxItem);
