import { FormApi } from "final-form";
import { Block, TextFieldForm, Typography } from "medulas-react-components";
import React from "react";

export const DESCRIPTION_FIELD = "Description";
const DESCRIPTION_PLACEHOLDER = "Enter Description of the proposal";

interface Props {
  form: FormApi;
}

const DescriptionField = ({ form }: Props): JSX.Element => {
  return (
    <Block marginTop={2}>
      <Typography>{DESCRIPTION_FIELD}</Typography>
      <TextFieldForm
        name={DESCRIPTION_FIELD}
        form={form}
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
