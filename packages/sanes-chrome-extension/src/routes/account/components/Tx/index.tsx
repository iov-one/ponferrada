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
    backgroundColor: theme.palette.grey[100],
  },
  icon: {
    padding: `0 ${theme.spacing(1)}px`,
  },
}));

const TxItem = ({ item, lastOne }: ItemProps): JSX.Element => {
  const classes = useStyles();
  const { time, amount, recipient, error } = item;

  const beautifulAmount = prettyAmount(amount);
  const icon = error ? iconErrorTx : iconSendTx;

  const msg = error ? (
    <MsgError onDetailedView={onDetailedView} amount={beautifulAmount} recipient={recipient} />
  ) : (
    <Msg onDetailedView={onDetailedView} amount={beautifulAmount} recipient={recipient} />
  );

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
