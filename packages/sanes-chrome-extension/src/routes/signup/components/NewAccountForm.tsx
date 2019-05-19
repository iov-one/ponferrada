import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import Back from 'medulas-react-components/lib/components/Button/Back';
import Form, {
  FormValues,
  useForm,
  ValidationError,
} from 'medulas-react-components/lib/components/forms/Form';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import * as React from 'react';

import { SIGNUP_ROUTE } from '../../paths';

export const ACCOUNT_NAME_FIELD = 'accountNameField';
export const PASSWORD_FIELD = 'passwordInputField';
export const PASSWORD_CONFIRM_FIELD = 'passwordConfirmInputField';

export const FIRST_STEP_SIGNUP_ROUTE = `${SIGNUP_ROUTE}1`;

const validate = (values: object): object => {
  const formValues = values as FormValues;
  let errors: ValidationError = {};
  if (!formValues[ACCOUNT_NAME_FIELD]) {
    errors[ACCOUNT_NAME_FIELD] = 'Required';
  }
  if (!formValues[PASSWORD_FIELD]) {
    errors[PASSWORD_FIELD] = 'Required';
  }
  if (!formValues[PASSWORD_CONFIRM_FIELD]) {
    errors[PASSWORD_CONFIRM_FIELD] = 'Required';
  }

  if (formValues[PASSWORD_FIELD] && formValues[PASSWORD_FIELD].length < 8) {
    errors[PASSWORD_FIELD] = 'Password should have at least 8 characters';
  }

  if (formValues[ACCOUNT_NAME_FIELD] && formValues[ACCOUNT_NAME_FIELD].length < 8) {
    errors[ACCOUNT_NAME_FIELD] = 'Username should have at least 8 characters';
  }

  if (formValues[PASSWORD_FIELD] !== formValues[PASSWORD_CONFIRM_FIELD]) {
    errors[PASSWORD_CONFIRM_FIELD] = 'Passwords mismatch';
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
    onSignup(formValues);
  };

  const { form, handleSubmit, pristine, submitting, invalid } = useForm({
    onSubmit,
    validate,
  });

  return (
    <PageLayout id={FIRST_STEP_SIGNUP_ROUTE} primaryTitle="New" title="Account">
      <Form onSubmit={handleSubmit}>
        <Block marginBottom={1}>
          <TextFieldForm
            label="Account name"
            placeholder="Account name"
            form={form}
            required
            fullWidth
            name={ACCOUNT_NAME_FIELD}
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
        <Block marginBottom={4}>
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
        <Block display="flex" justifyContent="space-between">
          <Block width={120}>
            <Back fullWidth onClick={onBack}>
              Back
            </Back>
          </Block>
          <Block width={120}>
            <Button fullWidth type="submit" disabled={invalid || pristine || submitting}>
              Continue
            </Button>
          </Block>
        </Block>
      </Form>
    </PageLayout>
  );
};

export default NewAccount;
