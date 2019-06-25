import { makeStyles } from '@material-ui/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { getPendingTransactions } from '../../store/notifications/selectors';
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

const Header = (): JSX.Element => {
  const classes = useStyles();
  const pendingTxs = useSelector(getPendingTransactions);
  const txs = useSelector(confirmedTxSelector);
  const lastTx = useSelector(lastTxSelector);

  return (
    <Block className={classes.root} padding={5}>
      <Img src={logoBlack} alt="Logo" />
      <Block flexGrow={1} />
      <LinksDesktop />
      <Block flexGrow={4} />
      <TransactionsMenu items={pendingTxs} />
      <BellMenu items={txs} lastTx={lastTx} />
      <HiMenu />
    </Block>
  );
};

export default Header;
