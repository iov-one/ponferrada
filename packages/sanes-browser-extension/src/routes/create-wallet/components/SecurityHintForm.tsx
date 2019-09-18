import {
  Back,
  Block,
  Button,
  Form,
  FormValues,
  TextField,
  Typography,
  useForm,
  ValidationError,
} from "medulas-react-components";
import * as React from "react";

import NeumaPageLayout from "../../../components/NeumaPageLayout";

export const SECURITY_HINT = "securityHintField";
export const CREATE_WALLET_ID_STEP_3 = "create-wallet-step3";

const validate = (values: object): object => {
  const formValues = values as FormValues;
  const errors: ValidationError = {};

  if (formValues[SECURITY_HINT] && formValues[SECURITY_HINT].length > 15) {
    errors[SECURITY_HINT] = "15 characters max - Spaces are allowed";
  }

  return errors;
};

interface Props {
  readonly onSaveHint: (values: FormValues) => void;
  readonly onBack: () => void;
}

const SecurityHintForm = ({ onSaveHint, onBack }: Props): JSX.Element => {
  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;
    onSaveHint(formValues);
  };

  const { form, handleSubmit, submitting, invalid } = useForm({
    onSubmit,
    validate,
  });

  return (
    <NeumaPageLayout id={CREATE_WALLET_ID_STEP_3} primaryTitle="New" title="Wallet">
      <Typography variant="subtitle1" inline>
        To help you remember your details in the future please provide a security hint:
      </Typography>
      <Form onSubmit={handleSubmit}>
        <Block marginTop={1} marginBottom={4}>
          <TextField placeholder="Security hint" form={form} fullWidth name={SECURITY_HINT} />
        </Block>
        <Block display="flex" justifyContent="space-between">
          <Block width={120}>
            <Back fullWidth onClick={onBack}>
              Back
            </Back>
          </Block>
          <Block width={120}>
            <Button fullWidth type="submit" disabled={invalid || submitting}>
              Create
            </Button>
          </Block>
        </Block>
      </Form>
    </NeumaPageLayout>
  );
};

export default SecurityHintForm;
