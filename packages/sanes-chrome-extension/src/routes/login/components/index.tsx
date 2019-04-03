import * as React from 'react';
import Button from 'medulas-react-components/lib/components/Button';
import Block from 'medulas-react-components/lib/components/Block';
import PageLayout from 'medulas-react-components/lib/components/PageLayout';
import Form, {
  useForm,
  FormValues,
  ValidationError,
} from 'medulas-react-components/lib/components/forms/Form';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';
import Typography from 'medulas-react-components/lib/components/Typography';
import Link from 'medulas-react-components/lib/components/Link';
import { LOGIN_ROUTE, WELCOME_ROUTE } from '../../paths';
import { history } from '../../../store/reducers/';

export const ACCOUNT_NAME_FIELD = 'accountNameField';
export const PASSWORD_FIELD = 'passwordInputField';

const backToWelcomeScreen = (): void => {
  history.push(WELCOME_ROUTE);
};

const validate = (values: object): object => {
  const formValues = values as FormValues;
  let errors: ValidationError = {};
  if (!formValues[ACCOUNT_NAME_FIELD]) {
    errors[ACCOUNT_NAME_FIELD] = 'Required';
  }
  if (!formValues[PASSWORD_FIELD]) {
    errors[PASSWORD_FIELD] = 'Required';
  }

  return errors;
};

const Layout = (): JSX.Element => {
  const onSubmit = async (_: object): Promise<void> => {
    //const formValues = values as FormValues;
  };

  const { form, handleSubmit, pristine, submitting, invalid } = useForm({
    onSubmit,
    validate,
  });

  return (
    <PageLayout id={LOGIN_ROUTE} primaryTitle="Log" title="In">
      <Form onSubmit={handleSubmit}>
        <Block marginBottom={1}>
          <TextFieldForm
            placeholder="Enter your unique identifier"
            form={form}
            required
            fullWidth
            name={ACCOUNT_NAME_FIELD}
          />
        </Block>
        <Block marginBottom={2}>
          <TextFieldForm
            placeholder="Password"
            type="password"
            form={form}
            required
            fullWidth
            name={PASSWORD_FIELD}
          />
        </Block>
        <Block display="flex" justifyContent="center">
          <Block width={120}>
            <Button
              fullWidth
              type="submit"
              disabled={invalid || pristine || submitting}
            >
              Continue
            </Button>
          </Block>
        </Block>
        <Block marginTop={4} textAlign="center">
          <Block marginBottom={1}>
            <Link>
              <Typography variant="subtitle2" color="primary" link inline>
                Restore account
              </Typography>
            </Link>
          </Block>
          <Block>
            <Link>
              <Typography
                variant="subtitle2"
                color="primary"
                link
                inline
                onClick={backToWelcomeScreen}
              >
                More options
              </Typography>
            </Link>
          </Block>
        </Block>
      </Form>
    </PageLayout>
  );
};

export default Layout;
