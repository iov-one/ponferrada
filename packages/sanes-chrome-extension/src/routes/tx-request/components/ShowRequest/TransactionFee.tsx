import { Fee } from '@iov/bcp';
import { makeStyles } from '@material-ui/core';
import { ListItem, ListItemText } from 'medulas-react-components/lib/components/List';
import React from 'react';

import { amountToGwei, amountToString } from '../../../../utils/balances';

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

  const values = new Array<string>();
  if (fee.tokens) values.push(amountToString(fee.tokens));
  if (fee.gasLimit) values.push(`Limit: ${fee.gasLimit}`);
  if (fee.gasPrice) values.push(`Price: ${amountToGwei(fee.gasPrice)}`);

  return (
    <ListItem>
      <ListItemText
        classes={listItemClasses}
        primary="Fee"
        secondary={values.length !== 0 ? values.join(' ') : 'none'}
        secondaryTypographyProps={txListItemSecondaryProps}
      />
    </ListItem>
  );
};

export default TransactionFee;
