import { FormApi } from "final-form";
import { Block, TextFieldForm, Typography } from "medulas-react-components";
import React from "react";

export const PUBKEY_REMOVE_FIELD = "Validator Pubkey to Remove";
const PUBKEY_REMOVE_PLACEHOLDER = "Enter the pubkey of the validator to remove";

interface Props {
  readonly form: FormApi;
}

const RemoveValidator = ({ form }: Props): JSX.Element => {
  return (
    <Block marginTop={2} display="flex" alignItems="center">
      <Typography>{PUBKEY_REMOVE_FIELD}</Typography>
      <Block marginLeft={2} flexGrow={1}>
        <TextFieldForm
          name={PUBKEY_REMOVE_FIELD}
          form={form}
          placeholder={PUBKEY_REMOVE_PLACEHOLDER}
          fullWidth
          margin="none"
        />
      </Block>
    </Block>
  );
};

export default RemoveValidator;
