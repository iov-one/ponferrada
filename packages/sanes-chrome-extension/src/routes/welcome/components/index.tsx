import * as React from 'react';
import Button from 'medulas-react-components/lib/components/Button';
import Typography from 'medulas-react-components/lib/components/Typography';
import Block from 'medulas-react-components/lib/components/Block';
import Image from 'medulas-react-components/lib/components/Image';
import iovLogo from '../../../assets/iov-logo.png';
import { WELCOME_ROUTE, SIGNUP_ROUTE } from '../../paths';
import { history } from '../../../store/reducers/';

const createNewAccount = (): void => {
  history.push(SIGNUP_ROUTE);
};

const Layout = (): JSX.Element => (
  <Block id={WELCOME_ROUTE} paddingRight={2} paddingLeft={2} paddingTop={2}>
    <Typography color="primary" variant="h4" inline>
      Welcome
    </Typography>
    <Typography variant="h4" inline>
      {' to your IOV manager'}
    </Typography>
    <Block padding={2} marginTop={3} marginBottom={1}>
      <Typography variant="body1" inline>
        This plugin lets you manage all your accounts in one place.
      </Typography>
      <Block marginTop={2} />
      <Button type="contained" fullWidth>
        Log in
      </Button>
      <Block marginTop={2} />
      <Button type="contained" fullWidth onClick={createNewAccount}>
        New account
      </Button>
      <Block marginTop={2} />
      <Button type="contained" fullWidth>
        Import account
      </Button>
    </Block>
    <Block textAlign="center" marginBottom={1}>
      <Image src={iovLogo} alt="IOV logo" />
    </Block>
  </Block>
);

export default Layout;
