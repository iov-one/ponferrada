import { isSendTransaction } from '@iov/bcp';
import { makeStyles, Theme } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import Img from 'medulas-react-components/lib/components/Image';
import * as React from 'react';
import { ProcessedTx } from '../../../../extension/background/model/persona';
import { prettyAmount } from '../../../../utils/balances';
import iconErrorTx from '../../assets/transactionError.svg';
import iconSendTx from '../../assets/transactionSend.svg';
import MsgError from './MsgError';
import Msg from './MsgSuccess';

interface ItemProps {
  readonly item: ProcessedTx;
  readonly lastOne: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  msg: {
    '& > span': {
      lineHeight: 1.3,
      marginBottom: theme.spacing(1),
    },
  },
  item: {
    backgroundColor: theme.palette.grey[50],
  },
  icon: {
    padding: `0 ${theme.spacing(1)}px`,
  },
}));

const TxItem = ({ item, lastOne }: ItemProps): JSX.Element => {
  const classes = useStyles();
  const { time, error } = item;

  let msg: JSX.Element;
  if (isSendTransaction(item.original)) {
    const { amount, recipient } = item.original;
    const beautifulAmount = prettyAmount(amount);
    msg = error ? (
      <MsgError amount={beautifulAmount} recipient={recipient} />
    ) : (
      <Msg
        blockExplorerUrl={item.blockExplorerUrl}
        amount={beautifulAmount}
        recipient={recipient}
        id={item.id}
      />
    );
  } else {
    throw new Error('Received transaction type that cannot be displayed');
  }

  const icon = error ? iconErrorTx : iconSendTx;
  return (
    <Block className={classes.item}>
      <ListItem disableGutters>
        <Img className={classes.icon} src={icon} height={32} alt="Tx operation" />
        <ListItemText className={classes.msg} primary={msg} secondary={time} />
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
