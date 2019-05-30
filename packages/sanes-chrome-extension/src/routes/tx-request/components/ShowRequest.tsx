import { SendTransaction } from '@iov/bcp';
import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import { List, ListItem, ListItemText } from 'medulas-react-components/lib/components/List';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';
import { amountToString } from '../../../utils/balances';
import { TX_REQUEST } from '../../paths';

export const TX_REQUEST_SHOW = `${TX_REQUEST}_show`;

interface Props {
  readonly onAcceptRequest: () => void;
  readonly showRejectView: () => void;
  readonly sender: string;
  readonly tx: SendTransaction;
}

const secondaryProps = {
  noWrap: true,
};

const Layout = ({ sender, tx, onAcceptRequest, showRejectView }: Props): JSX.Element => (
  <PageLayout id={TX_REQUEST_SHOW} primaryTitle="Tx" title="Request">
    <Block textAlign="center" marginBottom={2}>
      <Typography variant="body1" inline>
        {'The following site: '}
      </Typography>
      <Typography variant="body1" color="primary" inline>
        {sender}
      </Typography>
      <Typography variant="body1" inline>
        {' wants you to sign:'}
      </Typography>
    </Block>
    <List>
      <ListItem>
        <ListItemText
          primary="Beneficiary"
          secondary={tx.recipient}
          secondaryTypographyProps={secondaryProps}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Amount"
          secondary={amountToString(tx.amount)}
          secondaryTypographyProps={secondaryProps}
        />
      </ListItem>
      {tx.fee && tx.fee.tokens && (
        <ListItem>
          <ListItemText
            primary="Fee"
            secondary={amountToString(tx.fee.tokens)}
            secondaryTypographyProps={secondaryProps}
          />
        </ListItem>
      )}
      <ListItem>
        <ListItemText primary="Notes" secondary={tx.memo || '--'} secondaryTypographyProps={secondaryProps} />
      </ListItem>
    </List>
    <Block marginBottom={3} />
    <Button variant="contained" fullWidth onClick={onAcceptRequest}>
      Approve
    </Button>
    <Block marginTop={2} />
    <Button variant="contained" fullWidth color="secondary" onClick={showRejectView}>
      Reject
    </Button>
    <Block marginBottom={2} />
  </PageLayout>
);

export default Layout;
