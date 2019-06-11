import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import loading from '~/components/Header/assets/loading.svg';
import loadingSpin from '~/components/Header/assets/loadingSpin.svg';
import BadgeIcon from '~/components/layout/BadgeIcon';
import ListMenu, { PhoneHook } from '~/components/templates/menu/ListMenu';
import { Tx } from '~/store/notifications/state';
import { primary } from '~/theme/variables';
import GotIt from './GotIt';
import TransactionsList from './TransactionsList';

interface Props extends PhoneHook, WithStyles<typeof styles> {
  readonly items: ReadonlyArray<Tx>;
}

const styles = createStyles({
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

class TransactionsMenu extends React.Component<Props, State> {
  public readonly state = {
    showGotIt: localStorage.getItem(GOT_IT_KEY) === null,
  };

  public readonly onGotIt = () => {
    localStorage.setItem(GOT_IT_KEY, 'ACCEPTED');
    this.setState({ showGotIt: false });
  };

  public render(): JSX.Element {
    const { showGotIt } = this.state;
    const { classes, items, ...rest } = this.props;

    const hasPendingTxs = items.length > 0;
    const starterClasses = hasPendingTxs ? classes.spin : undefined;
    const logo = hasPendingTxs ? loadingSpin : loading;

    const starter = () => (
      <BadgeIcon
        invisible={!hasPendingTxs}
        icon={logo}
        className={starterClasses}
        alt="Loading Transactions"
        badge="dot"
      />
    );
    const color = showGotIt ? primary : 'white';

    return (
      <ListMenu starter={starter} color={color} listWidth={320} {...rest}>
        {showGotIt ? <GotIt onGotIt={this.onGotIt} /> : <TransactionsList items={items} />}
      </ListMenu>
    );
  }
}

export default withStyles(styles)(TransactionsMenu);
