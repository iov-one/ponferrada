import { FormApi } from "final-form";
import {
  Block,
  composeValidators,
  notLongerThan,
  required,
  TextFieldForm,
  Typography,
} from "medulas-react-components";
import React from "react";

export const TITLE_FIELD = "Title";
const TITLE_PLACEHOLDER = "Enter Title";
const TITLE_MAX_LENGTH = 30;

interface Props {
  readonly form: FormApi;
}

const TitleField = ({ form }: Props): JSX.Element => {
  const validator = composeValidators(required, notLongerThan(TITLE_MAX_LENGTH));

  return (
    <Block>
      <Typography>{TITLE_FIELD}</Typography>
      <TextFieldForm
        name={TITLE_FIELD}
        form={form}
        validate={validator}
        placeholder={TITLE_PLACEHOLDER}
        fullWidth
        margin="none"
      />
    </Block>
  );
};

export default TitleField;
