import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import EmptyListIcon from 'medulas-react-components/lib/templates/menu/EmptyListIcon';
import * as React from 'react';

import { Tx } from '../../../../store/notifications';
import { prettyAmount } from '../../../../utils/balances';
import { elipsify } from '../../../../utils/strings';
import noPendingTxs from '../../assets/noPendingTxs.svg';

interface Props {
  readonly items: ReadonlyArray<Tx>;
}

const Transactions = ({ items }: Props): JSX.Element => {
  const hasItems = items.length > 0;

  return (
    <React.Fragment>
      <ListItem>
        <ListItemText primary="Pending Transactions" />
      </ListItem>
      <Hairline />
      {hasItems ? (
        items.map((item: Tx, index: number) => {
          const { amount, recipient } = item;
          const lastOne = index + 1 === items.length;

          const beautifulAmount = prettyAmount(amount);
          const prettyReceiver = elipsify(recipient, 16);

          return (
            <React.Fragment key={item.id}>
              <ListItem>
                <Block paddingRight={2}>
                  <CircularProgress size={25} />
                </Block>
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
