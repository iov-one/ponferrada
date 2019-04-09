import * as React from 'react';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import {
  FormValues,
  ValidationError,
} from 'medulas-react-components/lib/components/forms/Form';
import LoginControls from './components/LoginControls';
import { LOGIN_ROUTE } from '../paths';
import {
  ACCOUNT_NAME_FIELD,
  PASSWORD_FIELD,
} from '../signup/components/NewAccountForm';
import LoginForm from './components/LoginForm';

const validate = (values: object): object => {
  const formValues = values as FormValues;
  let errors: ValidationError = {};
  if (!formValues[PASSWORD_FIELD]) {
    errors[PASSWORD_FIELD] = 'Required';
  }

  return errors;
};

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const onLogin = async (_: object): Promise<void> => {
  //const formValues = values as FormValues;
};

const Login = (): JSX.Element => {
  return (
    <PageLayout id={LOGIN_ROUTE} primaryTitle="Log" title="In">
      <LoginForm onLogin={onLogin} validate={validate} />
      <LoginControls />
    </PageLayout>
  );
};

export default Login;
