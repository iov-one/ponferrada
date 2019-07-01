import { SendTransaction } from '@iov/bcp';
import { makeStyles } from '@material-ui/core';
import { List, ListItem, ListItemText } from 'medulas-react-components/lib/components/List';
import * as React from 'react';
import { amountToString } from '../../../../utils/balances';

const useStyles = makeStyles({
  root: {
    margin: 0,
  },
});

const secondaryProps = {
  noWrap: true,
};

interface Props {
  readonly creator: string;
  readonly tx: SendTransaction;
}

const ReqSendTransaction = ({ tx, creator }: Props): JSX.Element => {
  const classes = useStyles();

  const listItemClasses = { root: classes.root };

  return (
    <List>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Creator"
          secondary={creator}
          secondaryTypographyProps={secondaryProps}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Beneficiary"
          secondary={tx.recipient}
          secondaryTypographyProps={secondaryProps}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Amount"
          secondary={amountToString(tx.amount)}
          secondaryTypographyProps={secondaryProps}
        />
      </ListItem>
      {tx.fee && tx.fee.tokens && (
        <ListItem>
          <ListItemText
            classes={listItemClasses}
            primary="Fee"
            secondary={amountToString(tx.fee.tokens)}
            secondaryTypographyProps={secondaryProps}
          />
        </ListItem>
      )}
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Notes"
          secondary={tx.memo || '--'}
          secondaryTypographyProps={secondaryProps}
        />
      </ListItem>
    </List>
  );
};

export default ReqSendTransaction;
