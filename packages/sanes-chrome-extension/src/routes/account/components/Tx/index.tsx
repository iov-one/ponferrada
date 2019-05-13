import { makeStyles, Theme } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import errorTx from '../../assets/transactionError.svg';
import receiveTx from '../../assets/transactionReceive.svg';
import sendTx from '../../assets/transactionSend.svg';
import MsgError from './MsgError';
import Msg from './MsgSuccess';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import Img from 'medulas-react-components/lib/components/Image';
import { prettyAmount } from '../../../../utils/balances';
import { ProcessedTx } from '../ListTxs';

interface ItemProps {
  readonly item: ProcessedTx;
  readonly lastOne: boolean;
}

const onDetailedView = (): void => {
  //history.push(DETAILED_VIEW_ROUTE);
};

const useStyles = makeStyles((theme: Theme) => ({
  msg: {
    '& > span': {
      lineHeight: 1.3,
      marginBottom: theme.spacing(1),
    },
  },
  item: {
    backgroundColor: theme.palette.grey[300],
  },
}));

const TxItem = ({ item, lastOne }: ItemProps): JSX.Element => {
  const classes = useStyles();
  const { time, amount, received, signer, recipient, success } = item;

  const beautifulAmount = prettyAmount(amount);
  const icon = success ? (received ? receiveTx : sendTx) : errorTx;

  const msg = success ? (
    <Msg
      onDetailedView={onDetailedView}
      received={received}
      amount={beautifulAmount}
      signer={signer}
      recipient={recipient}
    />
  ) : (
    <MsgError onDetailedView={onDetailedView} amount={beautifulAmount} recipient={recipient} />
  );

  return (
    <Block className={classes.item}>
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

export default TxItem;
