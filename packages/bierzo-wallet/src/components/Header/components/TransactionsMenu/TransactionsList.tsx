import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import noPendingTxs from '~/components/Header/assets/noPendingTxs.svg';
import Hairline from '~/components/layout/Hairline';
import EmptyListIcon from '~/components/templates/menu/EmptyListIcon';
import { prettyAmount } from '~/logic';
import { Tx } from '~/store/notifications/state';
import { border } from '~/theme/variables';
import { elipsify } from '~/utils/strings';

interface Props {
  readonly items: ReadonlyArray<Tx>;
}

const Transactions = ({ items }: Props) => {
  const hasItems = items.length > 0;

  return (
    <React.Fragment>
      <ListItem>
        <ListItemText primary="Pending Transactions" />
      </ListItem>
      <Hairline color={border} />
      {hasItems ? (
        items.map((item: Tx, index: number) => {
          const { amount, recipient } = item;
          const lastOne = index + 1 === items.length;

          const beautifulAmount = prettyAmount(amount);
          const prettyReceiver = elipsify(recipient, 16);

          return (
            <React.Fragment key={item.id}>
              <ListItem>
                <CircularProgress size={30} />
                <ListItemText primary={`${beautifulAmount} to ${prettyReceiver}`} secondary="... Sending" />
              </ListItem>
              {!lastOne && <Hairline />}
            </React.Fragment>
          );
        })
      ) : (
        <EmptyListIcon src={noPendingTxs} alt="No Pending Transactions" text="You are up to date!" />
      )}
    </React.Fragment>
  );
};

export default Transactions;
