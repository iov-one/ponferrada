import { RegisterUsernameTx } from '@iov/bns';
import Block from 'medulas-react-components/lib/components/Block';
import { List, ListItem, ListItemText } from 'medulas-react-components/lib/components/List';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

import TransactionFee, { txListItemSecondaryProps, useTxListItemStyles } from './TransactionFee';

export const REQ_REGISTER_USERNAME = 'req-register-username-tx';

interface Props {
  readonly tx: RegisterUsernameTx;
}

const ReqRegisterUsernameTx = ({ tx }: Props): JSX.Element => {
  const listItemClasses = useTxListItemStyles();

  return (
    <React.Fragment>
      <Typography variant="body1" inline color="primary" id={REQ_REGISTER_USERNAME}>
        {tx.username}*iov
      </Typography>
      <Typography variant="body1" inline>
        {' '}
        username registration request.
      </Typography>
      <Block marginTop={1} />
      <Typography variant="body1">Addresses:</Typography>
      <List>
        {tx.targets.map(target => (
          <ListItem key={target.address}>
            <ListItemText
              classes={listItemClasses}
              primary={target.chainId}
              secondary={target.address}
              secondaryTypographyProps={txListItemSecondaryProps}
            />
          </ListItem>
        ))}
      </List>
      <Block marginTop={1} />
      <List>
        <TransactionFee fee={tx.fee} />
      </List>
    </React.Fragment>
  );
};

export default ReqRegisterUsernameTx;
