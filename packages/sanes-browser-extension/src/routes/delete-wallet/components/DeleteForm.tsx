import {
  Block,
  Button,
  Form,
  FormValues,
  TextFieldForm,
  Typography,
  useForm,
} from "medulas-react-components";
import * as React from "react";

export const MNEMONIC_FIELD = "mnemonicInputField";

interface Props {
  readonly onDelete: (values: FormValues) => Promise<void>;
  readonly validate: (values: object) => object;
}

const UnlockForm = ({ onDelete, validate }: Props): JSX.Element => {
  const { form, handleSubmit, pristine, submitting, invalid } = useForm({
    onSubmit: onDelete,
    validate,
  });

  return (
    <React.Fragment>
      <Typography variant="subtitle1" inline>
        Are you sure want to completely delete this wallet? Please type current wallet recovery phrase into
        the field below.
      </Typography>
      <Form onSubmit={handleSubmit}>
        <Block marginBottom={2}>
          <TextFieldForm
            multiline
            rows={5}
            placeholder="Recovery phrase"
            form={form}
            required
            fullWidth
            name={MNEMONIC_FIELD}
          />
        </Block>
        <Block display="flex" justifyContent="center">
          <Block width={140}>
            <Button fullWidth type="submit" disabled={invalid || pristine || submitting} spinner={submitting}>
              Delete
            </Button>
          </Block>
        </Block>
      </Form>
    </React.Fragment>
  );
};

export default UnlockForm;
