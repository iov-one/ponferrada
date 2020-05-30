import { Back, Block, Button, Switch, Typography } from "medulas-react-components";
import * as React from "react";

import NeumaPageLayout from "../../../components/NeumaPageLayout";

export const CREATE_WALLET_ID_STEP_2 = "create-wallet-step2";

export interface Props {
  readonly mnemonic: string;
  readonly onHintPassword: () => void;
  readonly onBack: () => void;
}

const ShowWordsForm = ({ mnemonic, onBack, onHintPassword }: Props): JSX.Element => {
  const [visibleMnemonic, setVisibleMnemonic] = React.useState<string>("");

  const onToggleMnemonic = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    setVisibleMnemonic(checked ? mnemonic : "");
  };

  return (
    <NeumaPageLayout id={CREATE_WALLET_ID_STEP_2} primaryTitle="Recovery" title="Words">
      <Typography variant="body1" inline>
        Your secret recovery words consists of 12 words that act as a tool to recover your wallet on any
        platform.
      </Typography>
      <Block marginTop={2} />

      <Block display="flex" justifyContent="space-between" alignItems="center">
        <Block display="flex" alignItems="center">
          <Block marginRight={1}>
            <Typography variant="subtitle2" inline>
              Show/hide recovery words
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
    </NeumaPageLayout>
  );
};

export default ShowWordsForm;
