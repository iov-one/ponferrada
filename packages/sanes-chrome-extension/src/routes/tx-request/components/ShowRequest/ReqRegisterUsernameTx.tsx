import { RegisterUsernameTx } from '@iov/bns';
import { List, ListItem, ListItemText } from 'medulas-react-components/lib/components/List';
import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import { amountToString } from '../../../../utils/balances';
import Typography from 'medulas-react-components/lib/components/Typography';
import Block from 'medulas-react-components/lib/components/Block';

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
  readonly tx: RegisterUsernameTx;
}

const ReqRegisterUsernameTx = ({ tx }: Props): JSX.Element => {
  const classes = useStyles();

  const listItemClasses = { root: classes.root };

  return (
    <React.Fragment>
      <Typography variant="body1" inline color="primary">
        {tx.username}*iov
      </Typography>
      <Typography variant="body1" inline>
        {' '}
        username registration request.
      </Typography>
      <Block marginTop={1} />
      <Typography variant="body1">Addresses:</Typography>
      <List>
        {tx.addresses.map(address => (
          <ListItem>
            <ListItemText
              classes={listItemClasses}
              primary={address.chainId}
              secondary={address.address}
              secondaryTypographyProps={secondaryProps}
            />
          </ListItem>
        ))}
      </List>
      {tx.fee && tx.fee.tokens && (
        <React.Fragment>
          <Block marginTop={1} />
          <Typography variant="body1" inline>
            Fee:{' '}
          </Typography>
          <Typography variant="body1" inline>
            {amountToString(tx.fee.tokens)}
          </Typography>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ReqRegisterUsernameTx;
