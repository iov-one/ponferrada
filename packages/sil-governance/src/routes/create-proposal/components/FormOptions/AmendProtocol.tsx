import { FormApi } from "final-form";
import {
  Block,
  composeValidators,
  notLongerThan,
  required,
  TextField,
  Typography,
} from "medulas-react-components";
import React from "react";

export const TEXT_FIELD = "Resolution";
const TEXT_PLACEHOLDER = "Enter the resolution for the protocol amendment here";
const TEXT_MAX_LENGTH = 1000;

interface Props {
  readonly form: FormApi;
}

const AmendProtocol = ({ form }: Props): JSX.Element => {
  const validator = composeValidators(required, notLongerThan(TEXT_MAX_LENGTH));

  return (
    <Block marginTop={2}>
      <Typography>{TEXT_FIELD}</Typography>
      <TextField
        name={TEXT_FIELD}
        form={form}
        validate={validator}
        placeholder={TEXT_PLACEHOLDER}
        multiline
        rows="2"
        fullWidth
        margin="none"
      />
    </Block>
  );
};

export default AmendProtocol;
