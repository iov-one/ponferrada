import * as React from 'react';
import Button from 'medulas-react-components/lib/components/Button';
import Block from 'medulas-react-components/lib/components/Block';
import Form, { useForm } from 'medulas-react-components/lib/components/forms/Form';
import TextFieldForm from 'medulas-react-components/lib/components/forms/TextFieldForm';

export const PASSWORD_FIELD = 'passwordInputField';

interface Props {
  readonly onLogin: (values: object) => Promise<void>;
  readonly validate: (values: object) => object;
}

const LoginForm = ({ onLogin, validate }: Props): JSX.Element => {
  const { form, handleSubmit, pristine, submitting, invalid } = useForm({
    onSubmit: onLogin,
    validate,
  });

  return (
    <Form onSubmit={handleSubmit}>
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
          <Button fullWidth type="submit" disabled={invalid || pristine || submitting}>
            Continue
          </Button>
        </Block>
      </Block>
    </Form>
  );
};

export default LoginForm;
