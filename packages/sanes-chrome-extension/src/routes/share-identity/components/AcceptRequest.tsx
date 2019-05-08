import * as React from 'react';
import Button from 'medulas-react-components/lib/components/Button';
import Typography from 'medulas-react-components/lib/components/Typography';
import Block from 'medulas-react-components/lib/components/Block';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Back from 'medulas-react-components/lib/components/Button/Back';

interface Props {
  readonly onAcceptRequest: () => void;
  readonly onBack: () => void;
}

const Layout = ({ onBack, onAcceptRequest }: Props): JSX.Element => (
  <PageLayout primaryTitle="Share" title="Identity">
    <Block textAlign="center">
      <Typography variant="body1">The following site:</Typography>
      <Typography variant="body1" color="primary">
        http://finex.com
      </Typography>
      <Typography variant="body1" inline color="primary">
        will be able to see
      </Typography>
      <Typography variant="body1" inline>
        {' '}
        your identity on
      </Typography>
      <Typography variant="body1" inline color="primary">
        {' '}
        ETH
      </Typography>
    </Block>
    <Block marginTop={10} />
    <Button variant="contained" fullWidth onClick={onAcceptRequest}>
      Confirm
    </Button>
    <Block marginTop={2} />
    <Back fullWidth onClick={onBack}>
      Back
    </Back>
  </PageLayout>
);

export default Layout;
