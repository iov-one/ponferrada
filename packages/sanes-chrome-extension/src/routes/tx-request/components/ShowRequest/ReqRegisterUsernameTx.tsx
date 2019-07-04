import { RegisterUsernameTx } from '@iov/bns';
import { List, ListItem, ListItemText } from 'medulas-react-components/lib/components/List';
import * as React from 'react';
import Typography from 'medulas-react-components/lib/components/Typography';
import Block from 'medulas-react-components/lib/components/Block';
import TransactionFee, { useTxListItemStyles, txListItemSecondaryProps } from './TransactionFee';

export const REQ_REGISTER_USERNAME = 'req-register-username-tx';

interface Props {
  readonly creator: string;
  readonly tx: RegisterUsernameTx;
}

const ReqRegisterUsernameTx = ({ tx }: Props): JSX.Element => {
  const listItemClasses = useTxListItemStyles();

  const txFee = tx.fee ? <TransactionFee fee={tx.fee} /> : undefined;

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
      <List>{txFee}</List>
      <Block marginTop={1} />
      <Typography variant="body1">Addresses:</Typography>
      <List>
        {tx.addresses.map(address => (
          <ListItem key={address.address}>
            <ListItemText
              classes={listItemClasses}
              primary={address.chainId}
              secondary={address.address}
              secondaryTypographyProps={txListItemSecondaryProps}
            />
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
};

export default ReqRegisterUsernameTx;
