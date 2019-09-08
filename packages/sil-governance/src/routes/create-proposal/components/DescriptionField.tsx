import { FormApi } from "final-form";
import {
  Block,
  composeValidators,
  notLongerThan,
  required,
  TextFieldForm,
  Typography,
} from "medulas-react-components";
import React, { useMemo } from "react";

export const DESCRIPTION_FIELD = "Description";
const DESCRIPTION_PLACEHOLDER = "Enter Description of the proposal";
const DESCRIPTION_MAX_LENGTH = 1000;

interface Props {
  readonly form: FormApi;
}

const DescriptionField = ({ form }: Props): JSX.Element => {
  const validator = useMemo(() => composeValidators(required, notLongerThan(DESCRIPTION_MAX_LENGTH)), []);

  return (
    <Block marginTop={2}>
      <Typography>{DESCRIPTION_FIELD}</Typography>
      <TextFieldForm
        name={DESCRIPTION_FIELD}
        form={form}
        validate={validator}
        placeholder={DESCRIPTION_PLACEHOLDER}
        multiline
        rows="2"
        fullWidth
        margin="none"
      />
    </Block>
  );
};

export default DescriptionField;
