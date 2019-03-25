import * as React from 'react';
import Layout from '../components';

const Signup = (): JSX.Element => {
  const [step, setStep] = React.useState<'first' | 'second'>('first');

  return <Layout step={step} setStep={setStep} />;
};

export default Signup;
