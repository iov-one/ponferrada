import React from 'react';
import { makeStyles } from '@material-ui/core';
import { ListItem, ListItemText } from 'medulas-react-components/lib/components/List';
import { amountToString } from '../../../../utils/balances';
import { Fee } from '@iov/bcp';

export const useTxListItemStyles = makeStyles({
  root: {
    margin: 0,
  },
});

export const txListItemSecondaryProps = {
  noWrap: true,
};

interface Props {
  readonly fee: Fee;
}

const TransactionFee = ({ fee }: Props): JSX.Element => {
  const listItemClasses = useTxListItemStyles();

  if (!fee.tokens) return <React.Fragment />;

  return (
    <ListItem>
      <ListItemText
        classes={listItemClasses}
        primary="Fee"
        secondary={amountToString(fee.tokens)}
        secondaryTypographyProps={txListItemSecondaryProps}
      />
    </ListItem>
  );
};

export default TransactionFee;
