import { FormValues, ValidationError } from 'medulas-react-components/lib/components/forms/Form';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import { ToastContext } from 'medulas-react-components/lib/context/ToastProvider';
import { ToastVariant } from 'medulas-react-components/lib/context/ToastProvider/Toast';
import * as React from 'react';

import { history } from '../../store/reducers';
import { LOGIN_ROUTE } from '../paths';
import { PASSWORD_FIELD } from '../signup/components/NewAccountForm';
import LoginControls from './components/LoginControls';
import LoginForm from './components/LoginForm';

const validate = (values: object): object => {
  const formValues = values as FormValues;
  let errors: ValidationError = {};
  if (!formValues[PASSWORD_FIELD]) {
    errors[PASSWORD_FIELD] = 'Required';
  }

  return errors;
};

const Login = (): JSX.Element => {
  const toast = React.useContext(ToastContext);

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onLogin = async (_: object): Promise<void> => {
    toast.show('Toast message', ToastVariant.ERROR);
  };

  const onBack = (): void => {
    history.goBack();
  };

  return (
    <PageLayout id={LOGIN_ROUTE} primaryTitle="Log" title="In" onBack={onBack}>
      <LoginForm onLogin={onLogin} validate={validate} />
      <LoginControls />
    </PageLayout>
  );
};

export default Login;
