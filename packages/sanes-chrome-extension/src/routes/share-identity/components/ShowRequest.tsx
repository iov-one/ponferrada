import * as React from 'react';
import Button from 'medulas-react-components/lib/components/Button';
import Typography from 'medulas-react-components/lib/components/Typography';
import Block from 'medulas-react-components/lib/components/Block';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import { Request } from '../../../extension/background/actions/createPersona/requestHandler';
import { SHARE_IDENTITY } from '../../paths';

export const SHARE_IDENTITY_SHOW = `${SHARE_IDENTITY}_show`;

interface Props {
  readonly onAcceptRequest: () => void;
  readonly showRejectView: () => void;
  readonly request: Request;
}

const Layout = ({ request, onAcceptRequest, showRejectView }: Props): JSX.Element => (
  <PageLayout id={SHARE_IDENTITY_SHOW} primaryTitle="Share" title="Identity">
    <Block textAlign="center">
      <Typography variant="body1">The following site:</Typography>
      <Typography variant="body1" color="primary">
        {request.sender}
      </Typography>
      <Typography variant="body1" inline>
        wants to see your identity
      </Typography>
    </Block>
    <Block marginTop={10} />
    <Button variant="contained" fullWidth onClick={onAcceptRequest}>
      Accept
    </Button>
    <Block marginTop={2} />
    <Button variant="contained" fullWidth color="secondary" onClick={showRejectView}>
      Reject
    </Button>
  </PageLayout>
);

export default Layout;
