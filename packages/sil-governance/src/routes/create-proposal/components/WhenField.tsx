import { FormApi } from "final-form";
import {
  Block,
  composeValidators,
  FieldInputValue,
  required,
  TextFieldForm,
  Typography,
} from "medulas-react-components";
import React from "react";

const WHEN_FIELD = "When";
export const DATE_FIELD = "Date";

const weekMilliseconds = 7 * 24 * 3600 * 1000;

export const dateAfterNow = (value: FieldInputValue): string | undefined => {
  if (typeof value !== "string") throw new Error("Input must be a string");

  const date = new Date(value);
  const now = new Date();
  const dateLimit = new Date(now.getTime() + weekMilliseconds);

  if (now < date && date < dateLimit) {
    return undefined;
  } else {
    return "Must be a future date within 7 days";
  }
};

interface Props {
  readonly form: FormApi;
}

const WhenField = ({ form }: Props): JSX.Element => {
  const validator = composeValidators(required, dateAfterNow);

  return (
    <Block>
      <Typography>{WHEN_FIELD}</Typography>
      <TextFieldForm
        name={DATE_FIELD}
        form={form}
        validate={validator}
        type="datetime-local"
        fullWidth
        margin="none"
      />
    </Block>
  );
};

export default WhenField;
