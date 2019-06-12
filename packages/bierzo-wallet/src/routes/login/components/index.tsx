import * as React from 'react';
import PageColumn from 'medulas-react-components/lib/components/PageColumn';
import WelcomeMessage from './WelcomeMessage';
import PeopleImg from './LeftMenu';

const SignupSection = (): JSX.Element => <React.Fragment />;

interface Props {
  readonly onSubmit: (values: object) => void;
}

export default ({ onSubmit }: Props) => (
  <PageColumn
    icon="white"
    leftMenu={PeopleImg}
    onSubmit={onSubmit}
    primaryTitle="Welcome"
    secondaryTitle="to your IOV wallet"
    subtitle="Continue to access your account"
    renderHeader={SignupSection}
    formRender={WelcomeMessage}
    nextMsg="Continue"
  />
);
