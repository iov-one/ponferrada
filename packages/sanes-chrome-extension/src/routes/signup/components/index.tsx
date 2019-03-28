import * as React from 'react';
import Typography from 'medulas-react-components/lib/components/Typography';
import Block from 'medulas-react-components/lib/components/Block';
import { FormValues } from 'medulas-react-components/lib/components/forms/Form';
import Image from 'medulas-react-components/lib/components/Image';
import iovLogo from '../../../assets/iov-logo.png';
import { SIGNUP_ROUTE } from '../../paths';
import NewAccountForm from './NewAccountForm';

interface Props {
  readonly onSignup: (formValues: FormValues) => void;
}

const Layout = ({ onSignup }: Props): JSX.Element => {
  return (
    <Block
      id={`${SIGNUP_ROUTE}_first`}
      paddingRight={2}
      paddingLeft={2}
      paddingTop={2}
    >
      <Typography color="primary" variant="h4" inline>
        New
      </Typography>
      <Typography variant="h4" inline>
        {' Account'}
      </Typography>
      <Block padding={2} marginTop={3} marginBottom={1}>
        <NewAccountForm onSignup={onSignup} />
      </Block>
      <Block textAlign="center" marginBottom={1}>
        <Image src={iovLogo} alt="IOV logo" />
      </Block>
    </Block>
  );
};

export default Layout;
