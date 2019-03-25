import * as React from 'react';
import NewAccount from './NewAccount';
import RecoveryPhrase from './RecoveryPhrase';

export interface StepProps {
  readonly setStep: React.Dispatch<React.SetStateAction<'first' | 'second'>>;
}

interface Props extends StepProps {
  readonly step: string;
}

const Layout = ({ setStep, step }: Props): JSX.Element =>
  step === 'first' ? (
    <NewAccount setStep={setStep} />
  ) : (
    <RecoveryPhrase setStep={setStep} />
  );

export default Layout;
