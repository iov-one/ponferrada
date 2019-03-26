import * as React from 'react';
import NewAccount from './NewAccount';
import ShowPhrase from './ShowPhrase';

const Layout = (): JSX.Element => {
  const [step, setStep] = React.useState<'first' | 'second'>('first');
  const onShowPhrase = () => setStep('second');

  return step === 'first' ? (
    <NewAccount nextStep={onShowPhrase} />
  ) : (
    <ShowPhrase />
  );
};

export default Layout;
