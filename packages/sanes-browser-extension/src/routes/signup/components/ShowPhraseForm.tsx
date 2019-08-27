import { Back, Block, Button, PageLayout, Switch, Typography } from "medulas-react-components";
import * as React from "react";

import { SIGNUP_ROUTE } from "../../paths";

export const SECOND_STEP_SIGNUP_ROUTE = `${SIGNUP_ROUTE}2`;

export interface Props {
  readonly mnemonic: string;
  readonly onHintPassword: () => void;
  readonly onBack: () => void;
}

const ShowPhraseForm = ({ mnemonic, onBack, onHintPassword }: Props): JSX.Element => {
  const [visibleMnemonic, setVisibleMnemonic] = React.useState<string>("");

  const onToggleMnemonic = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    setVisibleMnemonic(checked ? mnemonic : "");
  };

  return (
    <PageLayout id={SECOND_STEP_SIGNUP_ROUTE} primaryTitle="Recovery" title="Phrase">
      <Typography variant="body1" inline>
        Your secret recovery phrase consists of 12 words that act as a tool to recover your wallet on any
        platform.
      </Typography>
      <Block marginTop={2} />

      <Block display="flex" justifyContent="space-between" alignItems="center">
        <Block display="flex" alignItems="center">
          <Block marginRight={1}>
            <Typography variant="subtitle2" inline>
              Show/hide recovery phrase
            </Typography>
          </Block>
        </Block>
        <Switch color="primary" onChange={onToggleMnemonic} />
      </Block>

      <Block
        padding={2}
        marginTop={0}
        marginBottom={4}
        minHeight={24}
        border={1}
        borderColor="grey.300"
        borderRadius={5}
        bgcolor="grey.300"
      >
        <Typography variant="body1" inline>
          {visibleMnemonic}
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
