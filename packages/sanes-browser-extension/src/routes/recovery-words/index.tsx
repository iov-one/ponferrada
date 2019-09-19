import * as React from "react";

import NeumaPageLayout from "../../components/NeumaPageLayout";
import { PersonaContext } from "../../context/PersonaProvider";
import { history } from "../../utils/history";
import { RECOVERY_WORDS_ROUTE } from "../paths";
import ShowRecoveryWords from "./components/ShowRecoveryWords";

const onBack = (): void => {
  history.goBack();
};

const RecoveryWords = (): JSX.Element => {
  const persona = React.useContext(PersonaContext);

  return (
    <NeumaPageLayout id={RECOVERY_WORDS_ROUTE} primaryTitle="Recovery" title="words" onBack={onBack}>
      <ShowRecoveryWords mnemonic={persona.mnemonic} />
    </NeumaPageLayout>
  );
};

export default RecoveryWords;
