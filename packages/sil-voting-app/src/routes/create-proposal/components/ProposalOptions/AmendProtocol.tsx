import { FormApi } from "final-form";
import { Block, TextFieldForm, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  form: FormApi;
}

const AmendProtocol = ({ form }: Props): JSX.Element => {
  return (
    <Block width="100%" display="flex" alignItems="center" marginTop={2} marginBottom={2}>
      <Typography>Custom Field for AmendProtocol </Typography>
      <TextFieldForm name="AmendProtocol" form={form} placeholder="AmendProtocol" fullWidth margin="none" />
    </Block>
  );
};

export default AmendProtocol;
