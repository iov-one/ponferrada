import { makeStyles } from '@material-ui/core';
import Block from 'medulas-react-components/lib/components/Block';
import Img from 'medulas-react-components/lib/components/Image';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { getPendingTransactions } from '../../store/notifications/selectors';
import logoBlack from './assets/logoBlack.svg';
import BellMenu from './components/BellMenu';
import HiMenu from './components/HiMenu';
import LinksMenu from './components/LinksMenu';
import TransactionsMenu from './components/TransactionsMenu';
import { confirmedTxSelector, lastTxSelector } from './selector';

const useStyles = makeStyles({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: '70px',
    backgroundColor: 'white',
  },
});

interface Props {
  path: string;
}

const Header = ({ path }: Props): JSX.Element => {
  const classes = useStyles();
  const pendingTxs = useSelector(getPendingTransactions);
  const txs = useSelector(confirmedTxSelector);
  const lastTx = useSelector(lastTxSelector);

  return (
    <Block className={classes.root} padding={3}>
      <Img src={logoBlack} alt="Logo" />
      <Block flexGrow={1} />
      <LinksMenu path={path} />
      <Block flexGrow={4} />
      <TransactionsMenu items={pendingTxs} />
      <BellMenu items={txs} lastTx={lastTx} />
      <HiMenu />
    </Block>
  );
};

export default Header;
