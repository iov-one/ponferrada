import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';
import { TX_REQUEST } from '../../paths';

export const TX_REQUEST_SHOW = `${TX_REQUEST}_show`;

interface Props {
  readonly onAcceptRequest: () => void;
  readonly showRejectView: () => void;
  readonly sender: string;
}

const Layout = ({ sender, onAcceptRequest, showRejectView }: Props): JSX.Element => (
  <PageLayout id={TX_REQUEST_SHOW} primaryTitle="Transaction" title="Request">
    <Hairline />
    <Block textAlign="center" marginTop={2} marginBottom={2}>
      <Typography variant="body1">The following site:</Typography>
      <Typography variant="body1" color="primary">
        {sender}
      </Typography>
      <Typography variant="body1" inline>
        is asking for the following transactions to be made.
      </Typography>
    </Block>
    <Block marginTop={6} />
    <Button variant="contained" fullWidth onClick={onAcceptRequest}>
      Approve
    </Button>
    <Block marginTop={2} />
    <Button variant="contained" fullWidth color="secondary" onClick={showRejectView}>
      Reject
    </Button>
  </PageLayout>
);

export default Layout;
