import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import CircleImage from 'medulas-react-components/lib/components/Image/CircleImage';
import React from 'react';
import icon from './assets/iov-logo.svg';

const Login = (): JSX.Element => {
  return (
    <Block
      width="100vw"
      height="auto"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <CircleImage alt="Logo" icon={icon} dia="200px" />
      <Block marginTop={5} marginBottom={5}>
        <h6>IOV Voting Dashboard</h6>
      </Block>
      <Block display="flex">
        <Button>LOG IN</Button>
      </Block>
    </Block>
  );
};

export default Login;
