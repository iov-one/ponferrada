import PageColumn from 'medulas-react-components/lib/pages/PageColumn';
import * as React from 'react';

const SignupSection = (): JSX.Element => <React.Fragment />;

const Login = (): JSX.Element => {
  const onSubmit = (_: object): void => {};

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
