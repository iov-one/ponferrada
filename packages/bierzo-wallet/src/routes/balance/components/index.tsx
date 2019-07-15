import { makeStyles, Theme } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import Img from 'medulas-react-components/lib/components/Image';
import Link from 'medulas-react-components/lib/components/Link';
import Tooltip from 'medulas-react-components/lib/components/Tooltip';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

import { BalanceState } from '../../../store/balances';
import { amountToString, trimAmount } from '../../../utils/balances';
import receive from '../assets/transactionReceive.svg';
import send from '../assets/transactionSend.svg';

interface Props {
  readonly name: string | undefined;
  readonly balance: BalanceState;
  readonly onSendPayment: () => void;
  readonly onReceivePayment: () => void;
}

const LISK_FAUCET = 'https://testnet-faucet.lisk.io';
const ETH_FACUET = 'https://faucet.rinkeby.io/';
const ERC20_DOCS = 'https://github.com/iov-one/wallet-demo/wiki/ERC20-demo-tokens';

interface CardProps {
  readonly text: string;
  readonly logo: string;
  readonly onAction?: () => void;
}

const useCardStyles = makeStyles({
  root: {
    cursor: 'pointer',
  },
});

const Card = ({ text, logo, onAction }: CardProps): JSX.Element => {
  const theme = useTheme<Theme>();
  const classes = useCardStyles();

  return (
    <Block
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

const BalanceLayout = ({ name, balance, onSendPayment, onReceivePayment }: Props): JSX.Element => {
  const hasBalance = balance && Object.keys(balance).length;
  const theme = useTheme<Theme>();

  return (
    <Block alignSelf="center">
      <Block margin={2} />
      <Block display="flex" alignItems="center" justifyContent="center" width={450}>
        <Card text="Send payment" logo={send} onAction={onSendPayment} />
        <Block flexGrow={1} />
        <Card text="Receive Payment" logo={receive} onAction={onReceivePayment} />
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
            {hasBalance ? 'Your currencies' : 'No funds available'}
          </Typography>
          <Block margin={2} />
          {Object.keys(balance).map(token => (
            <Typography
              key={balance[token].tokenTicker}
              link
              variant="h6"
              weight="regular"
              color="primary"
              align="center"
              onClick={onSendPayment}
            >
              {`${amountToString(trimAmount(balance[token]))}`}
            </Typography>
          ))}
          <Block margin={1} />
          <Block display="flex" alignItems="center" justifyContent="flex-end">
            <Typography inline variant="body2">
              need funds?
            </Typography>
            <Block padding={1} />
            <Tooltip maxWidth={350}>
              <Typography variant="body2">
                Claim test LSK: <Link to={LISK_FAUCET}>Lisk faucet</Link>
              </Typography>
              <Block margin={1} />
              <Typography variant="body2">
                Claim test ETH: <Link to={ETH_FACUET}>Rinkeby faucet</Link>
              </Typography>
              <Block margin={1} />
              <Typography variant="body2">
                Claim test ERC20s: <Link to={ERC20_DOCS}>read the docs</Link>
              </Typography>
            </Tooltip>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default BalanceLayout;
