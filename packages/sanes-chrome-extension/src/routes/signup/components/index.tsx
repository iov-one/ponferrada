import * as React from 'react';
import Typography from 'medulas-react-components/lib/components/Typography';
import Block from 'medulas-react-components/lib/components/Block';
import Image from 'medulas-react-components/lib/components/Image';
import iovLogo from '../../../assets/iov-logo.png';
import { SIGNUP_ROUTE } from '../../paths';
import NewAccountForm, { NewAccountProps } from './NewAccountForm';
import ShowPhraseForm from './ShowPhraseForm';

interface Props extends NewAccountProps {
  readonly step: string;
}

const Layout = ({ onSignup, step }: Props): JSX.Element => {
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
        {step === 'first' ? (
          <NewAccountForm onSignup={onSignup} />
        ) : (
          <ShowPhraseForm />
        )}
      </Block>
      <Block textAlign="center" marginBottom={1}>
        <Image src={iovLogo} alt="IOV logo" />
      </Block>
    </Block>
  );
};

export default Layout;
