import PageColumn from 'medulas-react-components/lib/pages/PageColumn';
import * as React from 'react';

const SignupSection = (): JSX.Element => <React.Fragment />;

interface Props {
  readonly onSubmit: (values: object) => void;
}

const Login = ({ onSubmit }: Props): JSX.Element => (
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

export default Login;
