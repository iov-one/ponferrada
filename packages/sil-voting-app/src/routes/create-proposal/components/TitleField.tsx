import { FormApi } from "final-form";
import Block from "medulas-react-components/lib/components/Block";
import TextFieldForm from "medulas-react-components/lib/components/forms/TextFieldForm";
import Typography from "medulas-react-components/lib/components/Typography";
import React from "react";

const TITLE_FIELD = "Title";
const TITLE_PLACEHOLDER = "Enter Title";

interface Props {
  form: FormApi;
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
