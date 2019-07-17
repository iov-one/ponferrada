import { Amount } from '@iov/bcp';
import { makeStyles, Theme } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import Img from 'medulas-react-components/lib/components/Image';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

import { amountToString, trimAmount } from '../../../utils/balances';
import { PAYMENT_ROUTE, RECEIVE_FROM_IOV_USER } from '../../paths';
import receive from '../assets/transactionReceive.svg';
import send from '../assets/transactionSend.svg';

interface Props {
  readonly name: string | undefined;
  readonly tokens: { [token: string]: Amount };
  readonly onSendPayment: () => void;
  readonly onReceivePayment: () => void;
}

interface CardProps {
  readonly id: string;
  readonly text: string;
  readonly logo: string;
  readonly onAction?: () => void;
}

const useCardStyles = makeStyles({
  root: {
    cursor: 'pointer',
  },
});

const Card = ({ id, text, logo, onAction }: CardProps): JSX.Element => {
  const theme = useTheme<Theme>();
  const classes = useCardStyles();

  return (
    <Block
      id={id}
      bgcolor={theme.palette.background.paper}
      display="flex"
      width={215}
      flexDirection="column"
      alignItems="center"
      height={90}
      justifyContent="center"
      onClick={onAction}
      className={classes.root}
    >
      <Img src={logo} height={36} width={36} alt={text} />
      <Typography>{text}</Typography>
    </Block>
  );
};

const BalanceLayout = ({ name, tokens, onSendPayment, onReceivePayment }: Props): JSX.Element => {
  const hasTokens = tokens && Object.keys(tokens).length;
  const theme = useTheme<Theme>();

  return (
    <Block alignSelf="center">
      <Block margin={2} />
      <Block display="flex" alignItems="center" justifyContent="center" width={450}>
        <Card id={PAYMENT_ROUTE} text="Send payment" logo={send} onAction={onSendPayment} />
        <Block flexGrow={1} />
        <Card id={RECEIVE_FROM_IOV_USER} text="Receive Payment" logo={receive} onAction={onReceivePayment} />
      </Block>
      <Block margin={2} />
      <Block flexGrow={1} />
      <Block bgcolor={theme.palette.background.paper} height="unset" width={450}>
        <Block padding={4} display="flex" flexDirection="column">
          <Typography variant="h5" align="center" weight="light">
            {name ? name : '--'}
          </Typography>
          <Hairline space={4} />
          <Typography variant="subtitle2" align="center">
            {hasTokens ? 'Your currencies' : 'No funds available'}
          </Typography>
          <Block margin={2} />
          {Object.keys(tokens).map(token => (
            <Typography
              key={tokens[token].tokenTicker}
              link
              variant="h6"
              weight="regular"
              color="primary"
              align="center"
              onClick={onSendPayment}
            >
              {`${amountToString(trimAmount(tokens[token]))}`}
            </Typography>
          ))}
          <Block margin={1} />
        </Block>
      </Block>
    </Block>
  );
};

export default BalanceLayout;
