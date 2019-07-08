import { makeStyles } from '@material-ui/core';
import Badge from 'medulas-react-components/lib/components/Badge';
import Image from 'medulas-react-components/lib/components/Image';
import ListMenu from 'medulas-react-components/lib/templates/menu/ListMenu';
import * as React from 'react';

import { Tx } from '../../../../store/notifications';
import loading from '../../assets/loading.svg';
import loadingSpin from '../../assets/loadingSpin.svg';
import GotIt from './GotIt';
import TransactionsList from './TransactionsList';

interface Props {
  readonly items: ReadonlyArray<Tx>;
}

const useStyles = makeStyles({
  spin: {
    animation: 'spinKeyframe 5s infinite linear',
  },
  '@keyframes spinKeyframe': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '50%': {
      transform: 'rotate(180deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
});

const GOT_IT_KEY = 'NOTIFICATIONS_GOT_IT';

interface State {
  readonly showGotIt: boolean;
}

const TransactionsMenu = ({ items, ...rest }: Props): JSX.Element => {
  const classes = useStyles();
  const [showGotIt, setShowGotIt] = React.useState(localStorage.getItem(GOT_IT_KEY) === null);

  const onGotIt = (): void => {
    localStorage.setItem(GOT_IT_KEY, 'ACCEPTED');
    setShowGotIt(false);
  };

  const hasPendingTxs = items.length > 0;
  const starterClasses = hasPendingTxs ? classes.spin : undefined;
  const logo = hasPendingTxs ? loadingSpin : loading;

  const starter = (): JSX.Element => (
    <Badge invisible={!hasPendingTxs} className={starterClasses} variant="dot">
      <Image src={logo} alt="Loading Transactions" />
    </Badge>
  );

  const color = showGotIt ? 'primary' : 'white';

  return (
    <ListMenu starter={starter} color={color} listWidth={320} {...rest}>
      {showGotIt ? <GotIt onGotIt={onGotIt} /> : <TransactionsList items={items} />}
    </ListMenu>
  );
};

export default TransactionsMenu;
