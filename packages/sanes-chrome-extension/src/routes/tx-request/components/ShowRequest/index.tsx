import { SendTransaction } from '@iov/bcp';
import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';
import { TX_REQUEST } from '../../../paths';
import Req from './Req';

export const TX_REQUEST_SHOW = `${TX_REQUEST}_show`;

interface Props {
  readonly onAcceptRequest: () => void;
  readonly showRejectView: () => void;
  readonly sender: string;
  readonly creator: string;
  readonly tx: SendTransaction;
}

const Layout = ({ sender, tx, creator, onAcceptRequest, showRejectView }: Props): JSX.Element => (
  <PageLayout id={TX_REQUEST_SHOW} color="white" primaryTitle="Tx" title="Request">
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
    <Req tx={tx} creator={creator} />
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
