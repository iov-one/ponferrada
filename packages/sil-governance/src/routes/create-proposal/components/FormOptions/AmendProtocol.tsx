import { FormApi } from "final-form";
import { Block, TextFieldForm, Typography } from "medulas-react-components";
import React from "react";

export const TEXT_FIELD = "Resolution";
const TEXT_PLACEHOLDER = "Enter the resolution for the protocol amendment here";

interface Props {
  readonly form: FormApi;
}

const AmendProtocol = ({ form }: Props): JSX.Element => {
  return (
    <Block marginTop={2}>
      <Typography>{TEXT_FIELD}</Typography>
      <TextFieldForm
        name={TEXT_FIELD}
        form={form}
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
