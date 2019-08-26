import { FormApi } from "final-form";
import { Block, TextFieldForm, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  readonly form: FormApi;
}

const AddCommitteeMember = ({ form }: Props): JSX.Element => {
  return (
    <Block width="100%" display="flex" alignItems="center" marginTop={2}>
      <Typography>Custom Field for AddCommitteeMember </Typography>
      <TextFieldForm
        name="AddCommitteeMember"
        form={form}
        placeholder="AddCommitteeMember"
        fullWidth
        margin="none"
      />
    </Block>
  );
};

export default AddCommitteeMember;
