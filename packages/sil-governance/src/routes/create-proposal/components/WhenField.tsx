import { FormApi } from "final-form";
import { Block, TextFieldForm, Typography } from "medulas-react-components";
import React from "react";

const WHEN_FIELD = "When";
export const DATE_FIELD = "Date";
export const TIME_FIELD = "Time";

interface Props {
  readonly form: FormApi;
}

const WhenField = ({ form }: Props): JSX.Element => {
  return (
    <Block>
      <Typography>{WHEN_FIELD}</Typography>
      <Block display="flex">
        <Block flexGrow={1}>
          <TextFieldForm name={DATE_FIELD} form={form} type="date" fullWidth margin="none" />
        </Block>
        <Block flexGrow={1} marginLeft={2}>
          <TextFieldForm name={TIME_FIELD} form={form} type="time" fullWidth margin="none" />
        </Block>
      </Block>
    </Block>
  );
};

export default WhenField;
