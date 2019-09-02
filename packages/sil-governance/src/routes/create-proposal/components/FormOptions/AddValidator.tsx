import { FormApi } from "final-form";
import { Block, TextFieldForm, Typography } from "medulas-react-components";
import React from "react";

export const PUBKEY_ADD_FIELD = "New Validator Pubkey";
const PUBKEY_ADD_PLACEHOLDER = "Enter the pubkey for the new validator";
export const POWER_FIELD = "Power";
const POWER_PLACEHOLDER = "0";

interface Props {
  readonly form: FormApi;
}

const AddValidator = ({ form }: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{PUBKEY_ADD_FIELD}</Typography>
        <Block marginLeft={2} flexGrow={1}>
          <TextFieldForm
            name={PUBKEY_ADD_FIELD}
            form={form}
            placeholder={PUBKEY_ADD_PLACEHOLDER}
            fullWidth
            margin="none"
          />
        </Block>
      </Block>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{POWER_FIELD}</Typography>
        <Block marginLeft={2}>
          <TextFieldForm name={POWER_FIELD} form={form} placeholder={POWER_PLACEHOLDER} margin="none" />
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default AddValidator;
