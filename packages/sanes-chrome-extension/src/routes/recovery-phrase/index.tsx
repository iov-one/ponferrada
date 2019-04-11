import * as React from 'react';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import ShowRecoveryPhrase from './components/ShowRecoveryPhrase';
import { RECOVERY_PHRASE_ROUTE } from '../paths';
import { history } from '../../store/reducers';
import { getMnemonic } from '../signup/components/ShowPhraseForm';

const onBack = (): void => {
  history.goBack();
};

const RecoveryPhrase = (): JSX.Element => {
  const [mnemonic, setMnemonic] = React.useState<string>('');

  React.useEffect((): void => {
    getMnemonic().then((mnemonic: string): void => setMnemonic(mnemonic));
  }, []);

  return (
    <PageLayout
      id={RECOVERY_PHRASE_ROUTE}
      primaryTitle="Recovery"
      title="phrase"
    >
      <ShowRecoveryPhrase onBack={onBack} mnemonic={mnemonic} />
    </PageLayout>
  );
};

export default RecoveryPhrase;
