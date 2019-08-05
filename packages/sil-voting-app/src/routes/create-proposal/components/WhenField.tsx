import { FormApi } from "final-form";
import Block from "medulas-react-components/lib/components/Block";
import TextFieldForm from "medulas-react-components/lib/components/forms/TextFieldForm";
import Typography from "medulas-react-components/lib/components/Typography";
import React from "react";

const WHEN_FIELD = "When";
const DATE_FIELD = "Date";
const DATE_PLACEHOLDER = "Choose date";
const TIME_FIELD = "Time";
const TIME_PLACEHOLDER = "Choose time";

interface Props {
  form: FormApi;
}

const WhenField = ({ form }: Props): JSX.Element => {
  return (
    <Block>
      <Typography>{WHEN_FIELD}</Typography>
      <Block display="flex">
        <Block flexGrow={1}>
          <TextFieldForm
            name={DATE_FIELD}
            form={form}
            placeholder={DATE_PLACEHOLDER}
            fullWidth
            margin="none"
          />
        </Block>
        <Block flexGrow={1} marginLeft={2}>
          <TextFieldForm
            name={TIME_FIELD}
            form={form}
            placeholder={TIME_PLACEHOLDER}
            fullWidth
            margin="none"
          />
        </Block>
      </Block>
    </Block>
  );
};

export default WhenField;
