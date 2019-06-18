import PageColumn from 'medulas-react-components/lib/pages/PageColumn';
import * as React from 'react';
import { history } from '..';
import { WELCOME_ROUTE } from '../paths';

const SignupSection = (): JSX.Element => <React.Fragment />;

const Login = (): JSX.Element => {
  const onSubmit = (_: object): void => {
    history.push(WELCOME_ROUTE);
  };

  return (
    <PageColumn
      icon="white"
      onSubmit={onSubmit}
      primaryTitle="Welcome"
      secondaryTitle="to your IOV wallet"
      subtitle="Continue to access your account"
      renderHeader={SignupSection}
      nextMsg="Continue"
    />
  );
};

export default Login;
