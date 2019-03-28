import * as React from 'react';
import Layout from './components';
import { FormValues } from 'medulas-react-components/lib/components/forms/Form';

const dumpMethod = (formValues: FormValues): void => {
  console.log('Goto next screen with ' + formValues);
};

const Signup = (): JSX.Element => {
  return <Layout onSignup={dumpMethod} />;
};

export default Signup;
