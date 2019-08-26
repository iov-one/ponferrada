import { FormApi } from "final-form";
import { Block, TextFieldForm, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  readonly form: FormApi;
}

const AmendCommitteeThreshold = ({ form }: Props): JSX.Element => {
  return (
    <Block width="100%" display="flex" alignItems="center" marginTop={2} marginBottom={2}>
      <Typography>Custom Field for AmendCommitteeThreshold </Typography>
      <TextFieldForm
        name="AmendCommitteeThreshold"
        form={form}
        placeholder="AmendCommitteeThreshold"
        fullWidth
        margin="none"
      />
    </Block>
  );
};

export default AmendCommitteeThreshold;
