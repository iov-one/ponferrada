import { isSendTransaction } from '@iov/bcp';
import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';
import { SupportedTransaction } from '../../../../extension/background/model/persona';
import { TX_REQUEST } from '../../../paths';
import ReqSendTransaction from './ReqSendTransaction';

export const TX_REQUEST_SHOW = `${TX_REQUEST}_show`;

interface Props {
  readonly onAcceptRequest: () => void;
  readonly showRejectView: () => void;
  readonly sender: string;
  readonly creator: string;
  readonly tx: SupportedTransaction;
}

const Layout = ({ sender, tx, creator, onAcceptRequest, showRejectView }: Props): JSX.Element => {
  let req: JSX.Element;

  if (isSendTransaction(tx)) {
    req = <ReqSendTransaction tx={tx} creator={creator} />;
  } else {
    throw new Error('Received transaction type that cannot be displayed');
  }

  return (
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
      {req}
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
};

export default Layout;
