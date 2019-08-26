import { FormApi } from "final-form";
import { Block, TextFieldForm, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  readonly form: FormApi;
}

const AddValidator = ({ form }: Props): JSX.Element => {
  return (
    <Block width="100%" display="flex" alignItems="center" marginTop={2} marginBottom={2}>
      <Typography>Custom Field for AddValidator </Typography>
      <TextFieldForm name="AddValidator" form={form} placeholder="AddValidator" fullWidth margin="none" />
    </Block>
  );
};

export default AddValidator;
