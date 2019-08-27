import { FormApi } from "final-form";
import { Block, TextFieldForm, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  readonly form: FormApi;
}

const RemoveValidator = ({ form }: Props): JSX.Element => {
  return (
    <Block width="100%" display="flex" alignItems="center" marginTop={2} marginBottom={2}>
      <Typography>Custom Field for RemoveValidator </Typography>
      <TextFieldForm
        name="RemoveValidator"
        form={form}
        placeholder="RemoveValidator"
        fullWidth
        margin="none"
      />
    </Block>
  );
};

export default RemoveValidator;
