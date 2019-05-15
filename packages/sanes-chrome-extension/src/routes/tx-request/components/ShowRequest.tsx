import * as React from 'react';
import Button from 'medulas-react-components/lib/components/Button';
import Typography from 'medulas-react-components/lib/components/Typography';
import Block from 'medulas-react-components/lib/components/Block';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import { TX_REQUEST } from '../../paths';
import Hairline from 'medulas-react-components/lib/components/Hairline';

export const TX_REQUEST_SHOW = `${TX_REQUEST}_show`;

interface Props {
  readonly onAcceptRequest: () => void;
  readonly showRejectView: () => void;
}

const Layout = ({ onAcceptRequest, showRejectView }: Props): JSX.Element => (
  <PageLayout id={TX_REQUEST_SHOW} primaryTitle="Transaction" title="Request">
    <Hairline />
    <Block textAlign="center" marginTop={2} marginBottom={2}>
      <Typography variant="body1">The following site:</Typography>
      <Typography variant="body1" color="primary">
        http://finex.com
      </Typography>
      <Typography variant="body1" inline>
        is asking for the following transactions to be made.
      </Typography>
    </Block>
    <Hairline />
    <Block marginTop={2} marginBottom={2}>
      <Block display="flex" alignItems="center">
        <Block flex="1 0 1px">
          <Block marginLeft={6}>
            <Typography variant="body1">Fee</Typography>
          </Block>
        </Block>
        <Block flex="1 0 1px">
          <Typography variant="h6">0,0288 ETH</Typography>
        </Block>
      </Block>
      <Block display="flex" alignItems="center">
        <Block flex="1 0 1px">
          <Block marginLeft={6}>
            <Typography variant="body1">Register</Typography>
          </Block>
        </Block>
        <Block flex="1 0 1px">
          <Typography variant="h6">billy*iov</Typography>
        </Block>
      </Block>
    </Block>
    <Hairline />
    <Block marginTop={4} />
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
