import {
  Back,
  Block,
  Button,
  CheckboxField,
  Form,
  FormValues,
  Link,
  PageLayout,
  TextFieldForm,
  Typography,
  useForm,
  ValidationError,
} from "medulas-react-components";
import * as React from "react";

import { SIGNUP_ROUTE, TERMS_URL } from "../../paths";

export const WALLET_NAME_FIELD = "walletNameField";
export const PASSWORD_FIELD = "passwordInputField";
export const PASSWORD_CONFIRM_FIELD = "passwordConfirmInputField";
export const TERMS_ACCEPT_FIELD = "termsAcceptCheckboxField";

export const FIRST_STEP_SIGNUP_ROUTE = `${SIGNUP_ROUTE}1`;

const validate = (values: object): object => {
  const formValues = values as FormValues;
  let errors: ValidationError = {};
  if (!formValues[WALLET_NAME_FIELD]) {
    errors[WALLET_NAME_FIELD] = "Required";
  }
  if (!formValues[PASSWORD_FIELD]) {
    errors[PASSWORD_FIELD] = "Required";
  }
  if (!formValues[PASSWORD_CONFIRM_FIELD]) {
    errors[PASSWORD_CONFIRM_FIELD] = "Required";
  }

  if (formValues[PASSWORD_FIELD] && formValues[PASSWORD_FIELD].length < 8) {
    errors[PASSWORD_FIELD] = "Password should have at least 8 characters";
  }

  if (formValues[WALLET_NAME_FIELD] && formValues[WALLET_NAME_FIELD].length < 8) {
    errors[WALLET_NAME_FIELD] = "Username should have at least 8 characters";
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
  readonly onSignup: (values: FormValues) => void;
  readonly onBack: () => void;
}

const NewAccount = ({ onSignup, onBack }: Props): JSX.Element => {
  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;
    await onSignup(formValues);
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
    <PageLayout id={FIRST_STEP_SIGNUP_ROUTE} primaryTitle="New" title="Wallet">
      <Form onSubmit={handleSubmit}>
        <Block marginBottom={1}>
          <TextFieldForm
            label="Wallet name"
            placeholder="Wallet name"
            form={form}
            required
            fullWidth
            name={WALLET_NAME_FIELD}
          />
        </Block>
        <Block marginBottom={1}>
          <TextFieldForm
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
          <TextFieldForm
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
    </PageLayout>
  );
};

export default NewAccount;
