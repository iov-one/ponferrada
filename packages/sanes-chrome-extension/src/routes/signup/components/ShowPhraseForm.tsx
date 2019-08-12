import { Back, Block, Button, PageLayout, Switch, Tooltip, Typography } from "medulas-react-components";
import * as React from "react";

import { PersonaContext } from "../../../context/PersonaProvider";
import { SIGNUP_ROUTE } from "../../paths";

export const SECOND_STEP_SIGNUP_ROUTE = `${SIGNUP_ROUTE}2`;

export interface Props {
  readonly onHintPassword: () => void;
  readonly onBack: () => void;
}

const ShowPhraseForm = ({ onBack, onHintPassword }: Props): JSX.Element => {
  const [mnemonic, setMnemonic] = React.useState<string>("");
  const persona = React.useContext(PersonaContext);

  const onShowMnemonic = async (_: React.ChangeEvent<HTMLInputElement>, checked: boolean): Promise<void> => {
    if (checked) {
      setMnemonic(persona.mnemonic);
      return;
    }

    setMnemonic("");
  };

  return (
    <PageLayout id={SECOND_STEP_SIGNUP_ROUTE} primaryTitle="New" title="Account">
      <Block display="flex" justifyContent="space-between" alignItems="center">
        <Block display="flex" alignItems="center">
          <Block marginRight={1}>
            <Typography variant="subtitle2" inline>
              Activate Recovery Phrase?
            </Typography>
          </Block>
          <Tooltip>
            <Typography variant="body2">
              Your Recovery Phrase are 12 random words that are set in a particular order that acts as a tool
              to recover or back up your wallet on any platform.
            </Typography>
          </Tooltip>
        </Block>
        <Switch color="primary" onChange={onShowMnemonic} />
      </Block>

      <Block
        padding={2}
        marginTop={1}
        marginBottom={4}
        minHeight={24}
        border={1}
        borderColor="grey.300"
        borderRadius={5}
        bgcolor="grey.300"
      >
        <Typography variant="body1" inline>
          {mnemonic}
        </Typography>
      </Block>
      <Block display="flex" justifyContent="space-between">
        <Block width={120}>
          <Back fullWidth onClick={onBack}>
            Back
          </Back>
        </Block>
        <Block width={120}>
          <Button fullWidth onClick={onHintPassword}>
            Continue
          </Button>
        </Block>
      </Block>
    </PageLayout>
  );
};

export default ShowPhraseForm;
