import { FormApi } from "final-form";
import {
  Block,
  composeValidators,
  FieldInputValue,
  longerThan,
  notLongerThan,
  required,
  TextField,
  Typography,
} from "medulas-react-components";
import React from "react";

export const TITLE_FIELD = "Title";
const TITLE_PLACEHOLDER = "Enter Title";
const TITLE_MIN_LENGTH = 10;
const TITLE_MAX_LENGTH = 50;

interface Props {
  readonly form: FormApi;
}

const TitleField = ({ form }: Props): JSX.Element => {
  const charsetValidator = (value: FieldInputValue): string | undefined => {
    if (typeof value !== "string") throw new Error("Input must be a string");

    const isCharsetValid = !!value.match(/^[a-zA-Z0-9 _.-]*$/);

    if (isCharsetValid) return undefined;
    return `Symbols supported: ".", "-", "_"`;
  };

  const validator = composeValidators(
    required,
    longerThan(TITLE_MIN_LENGTH),
    notLongerThan(TITLE_MAX_LENGTH),
    charsetValidator,
  );

  return (
    <Block>
      <Typography>{TITLE_FIELD}</Typography>
      <TextField
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
