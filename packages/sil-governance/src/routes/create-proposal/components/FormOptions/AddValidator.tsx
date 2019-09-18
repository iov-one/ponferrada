import { FormApi } from "final-form";
import {
  Block,
  composeValidators,
  greaterOrEqualThan,
  required,
  TextField,
  Typography,
} from "medulas-react-components";
import React from "react";

export const PUBKEY_ADD_FIELD = "New Validator Pubkey";
const PUBKEY_ADD_PLACEHOLDER = "Enter the pubkey for the new validator";

export const POWER_FIELD = "Power";
const POWER_MIN_VALUE = 1;
const POWER_PLACEHOLDER = POWER_MIN_VALUE.toString();

interface Props {
  readonly form: FormApi;
}

const AddValidator = ({ form }: Props): JSX.Element => {
  const powerValidator = composeValidators(required, greaterOrEqualThan(POWER_MIN_VALUE));

  return (
    <React.Fragment>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{PUBKEY_ADD_FIELD}</Typography>
        <Block marginLeft={2} flexGrow={1}>
          <TextField
            name={PUBKEY_ADD_FIELD}
            form={form}
            validate={required}
            placeholder={PUBKEY_ADD_PLACEHOLDER}
            fullWidth
            margin="none"
          />
        </Block>
      </Block>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{POWER_FIELD}</Typography>
        <Block marginLeft={2}>
          <TextField
            name={POWER_FIELD}
            form={form}
            type="number"
            validate={powerValidator}
            placeholder={POWER_PLACEHOLDER}
            margin="none"
          />
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default AddValidator;
