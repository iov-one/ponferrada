import { Block, Button, Form, FormValues, TextField, useForm } from "medulas-react-components";
import * as React from "react";

export const PASSWORD_FIELD = "passwordInputField";

interface Props {
  readonly onUnlock: (values: FormValues) => Promise<void>;
  readonly validate: (values: object) => object;
}

const UnlockForm = ({ onUnlock, validate }: Props): JSX.Element => {
  const { form, handleSubmit, pristine, submitting, invalid } = useForm({
    onSubmit: onUnlock,
    validate,
  });

  return (
    <Form onSubmit={handleSubmit}>
      <Block marginBottom={2}>
        <TextField
          placeholder="Password"
          type="password"
          form={form}
          required
          fullWidth
          name={PASSWORD_FIELD}
        />
      </Block>
      <Block display="flex" justifyContent="center">
        <Block width={140}>
          <Button fullWidth type="submit" disabled={invalid || pristine || submitting} spinner={submitting}>
            Continue
          </Button>
        </Block>
      </Block>
    </Form>
  );
};

export default UnlockForm;
