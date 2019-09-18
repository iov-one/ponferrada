import {
  Back,
  Block,
  Button,
  CheckboxField,
  Form,
  FormValues,
  Link,
  TextField,
  Typography,
  useForm,
  ValidationError,
} from "medulas-react-components";
import * as React from "react";

import NeumaPageLayout from "../../../components/NeumaPageLayout";
import { TERMS_URL } from "../../paths";

export const PASSWORD_FIELD = "passwordInputField";
export const PASSWORD_CONFIRM_FIELD = "passwordConfirmInputField";
export const TERMS_ACCEPT_FIELD = "termsAcceptCheckboxField";

export const CREATE_WALLET_ID_STEP_1 = "create-wallet-step1";

const validate = (values: object): object => {
  const formValues = values as FormValues;
  const errors: ValidationError = {};
  if (!formValues[PASSWORD_FIELD]) {
    errors[PASSWORD_FIELD] = "Required";
  }
  if (!formValues[PASSWORD_CONFIRM_FIELD]) {
    errors[PASSWORD_CONFIRM_FIELD] = "Required";
  }

  if (formValues[PASSWORD_FIELD] && formValues[PASSWORD_FIELD].length < 8) {
    errors[PASSWORD_FIELD] = "Password should have at least 8 characters";
  }

  if (formValues[PASSWORD_FIELD] !== formValues[PASSWORD_CONFIRM_FIELD]) {
    errors[PASSWORD_CONFIRM_FIELD] = "Passwords mismatch";
  }

  if (!formValues[TERMS_ACCEPT_FIELD]) {
    errors[TERMS_ACCEPT_FIELD] = "You should accept T&C in order to continue";
  }

  return errors;
};

interface Props {
  readonly onCreateWallet: (values: FormValues) => void;
  readonly onBack: () => void;
}

const NewWalletForm = ({ onCreateWallet, onBack }: Props): JSX.Element => {
  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;
    await onCreateWallet(formValues);
  };

  const { form, handleSubmit, pristine, submitting, invalid } = useForm({
    onSubmit,
    validate,
  });

  const termsCheckboxLabel = (
    <React.Fragment>
      <Typography variant="subtitle1" inline>
        I have read and agree the{" "}
      </Typography>
      <Link to={TERMS_URL}>
        <Typography link color="primary" variant="subtitle1" inline>
          T&amp;C
        </Typography>
      </Link>
    </React.Fragment>
  );

  return (
    <NeumaPageLayout id={CREATE_WALLET_ID_STEP_1} primaryTitle="New" title="Wallet">
      <Form onSubmit={handleSubmit}>
        <Block marginBottom={1}>
          <TextField
            label="Password"
            placeholder="Password"
            type="password"
            form={form}
            required
            fullWidth
            name={PASSWORD_FIELD}
          />
        </Block>
        <Block>
          <TextField
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
            form={form}
            required
            fullWidth
            name={PASSWORD_CONFIRM_FIELD}
          />
        </Block>
        <Block marginBottom={2}>
          <CheckboxField
            initial={false}
            form={form}
            fieldName={TERMS_ACCEPT_FIELD}
            label={termsCheckboxLabel}
          />
        </Block>
        <Block display="flex" justifyContent="space-between">
          <Block width={140}>
            <Back fullWidth onClick={onBack}>
              Back
            </Back>
          </Block>
          <Block width={140}>
            <Button fullWidth type="submit" disabled={invalid || pristine || submitting} spinner={submitting}>
              Continue
            </Button>
          </Block>
        </Block>
      </Form>
    </NeumaPageLayout>
  );
};

export default NewWalletForm;
