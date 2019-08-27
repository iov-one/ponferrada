import { FormApi } from "final-form";
import { Block, TextFieldForm, Typography } from "medulas-react-components";
import React from "react";

export const TITLE_FIELD = "Title";
const TITLE_PLACEHOLDER = "Enter Title";

interface Props {
  readonly form: FormApi;
}

const TitleField = ({ form }: Props): JSX.Element => {
  return (
    <Block>
      <Typography>{TITLE_FIELD}</Typography>
      <TextFieldForm name={TITLE_FIELD} form={form} placeholder={TITLE_PLACEHOLDER} fullWidth margin="none" />
    </Block>
  );
};

export default TitleField;
