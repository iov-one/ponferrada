import { SendTransaction } from '@iov/bcp';
import { List, ListItem, ListItemText } from 'medulas-react-components/lib/components/List';
import * as React from 'react';

import { amountToString } from '../../../../utils/balances';
import TransactionFee, { txListItemSecondaryProps, useTxListItemStyles } from './TransactionFee';

export const REQ_SEND_TX = 'req-send-tx';

interface Props {
  readonly creator: string;
  readonly tx: SendTransaction;
}

const ReqSendTransaction = ({ tx, creator }: Props): JSX.Element => {
  const listItemClasses = useTxListItemStyles();

  const txFee = tx.fee ? <TransactionFee fee={tx.fee} /> : undefined;

  return (
    <List id={REQ_SEND_TX}>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Creator"
          secondary={creator}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Beneficiary"
          secondary={tx.recipient}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Amount"
          secondary={amountToString(tx.amount)}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
      {txFee}
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Notes"
          secondary={tx.memo || '--'}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
    </List>
  );
};

export default ReqSendTransaction;
