import * as React from 'react';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Typography from 'medulas-react-components/lib/components/Typography';
import { RECOVERY_PHRASE_ROUTE } from '../paths';

const RecoveryPhrase = (): JSX.Element => {
  return (
    <PageLayout
      id={RECOVERY_PHRASE_ROUTE}
      primaryTitle="Recovery"
      title="phrase"
    >
      <Typography variant="body1" inline>
        Show recovery phrase here
      </Typography>
    </PageLayout>
  );
};

export default RecoveryPhrase;
