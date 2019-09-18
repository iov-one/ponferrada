import {
  Back,
  Block,
  Button,
  composeValidators,
  Form,
  FormValues,
  longerThan,
  required,
  TextField,
  Typography,
  useForm,
  ValidationError,
} from "medulas-react-components";
import * as React from "react";
import { useMemo } from "react";

import NeumaPageLayout from "../../../components/NeumaPageLayout";
import { RESTORE_WALLET } from "../../paths";

export const SET_PASSWORD_STEP_RESTORE_WALLET_ROUTE = `${RESTORE_WALLET}2`;

export const PASSWORD_FIELD = "passwordField";
const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_CONFIRM_FIELD = "passwordConfirmField";

const validate = (values: object): object => {
  const formValues = values as FormValues;
  const errors: ValidationError = {};

  if (formValues[PASSWORD_FIELD] !== formValues[PASSWORD_CONFIRM_FIELD]) {
    errors[PASSWORD_CONFIRM_FIELD] = "Passwords mismatch";
  }

  return errors;
};

interface Props {
  readonly onSetPassword: (values: FormValues) => void;
  readonly onBack: () => void;
}

const SetPasswordForm = ({ onSetPassword, onBack }: Props): JSX.Element => {
  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;
    onSetPassword(formValues);
  };

  const { form, handleSubmit, submitting, invalid } = useForm({
    onSubmit,
    validate,
  });

  // TODO optimize update of validators with array of dependencies
  const validatorPassword = useMemo(() => {
    return composeValidators(required, longerThan(PASSWORD_MIN_LENGTH));
  }, []);

  const validatorPasswordConfirm = useMemo(() => {
    return required;
  }, []);

  return (
    <NeumaPageLayout id={SET_PASSWORD_STEP_RESTORE_WALLET_ROUTE} primaryTitle="Restore" title="Wallet">
      <Typography variant="subtitle1" inline>
        Enter the new password that will be used to encrypt your profile.
      </Typography>
      <Form onSubmit={handleSubmit}>
        <Block marginTop={2} marginBottom={1}>
          <TextField
            label="Password"
            placeholder="Password"
            type="password"
            form={form}
            required
            fullWidth
            name={PASSWORD_FIELD}
            validate={validatorPassword}
          />
        </Block>
        <Block marginBottom={4}>
          <TextField
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
            form={form}
            required
            fullWidth
            name={PASSWORD_CONFIRM_FIELD}
            validate={validatorPasswordConfirm}
          />
        </Block>
        <Block display="flex" justifyContent="space-between">
          <Block width={120}>
            <Back fullWidth onClick={onBack}>
              Back
            </Back>
          </Block>
          <Block width={120}>
            <Button fullWidth type="submit" disabled={invalid || submitting}>
              Restore
            </Button>
          </Block>
        </Block>
      </Form>
    </NeumaPageLayout>
  );
};

export default SetPasswordForm;
