import { FormApi } from "final-form";
import { Block, TextFieldForm, Typography } from "medulas-react-components";
import React from "react";

const AMOUNT_LABEL = "Amount";
export const RELEASE_QUANTITY_FIELD = "Quantity";
const RELEASE_QUANTITY_PLACEHOLDER = "Quantity";
export const RELEASE_DIGITS_FIELD = "Fractional Digits";
const RELEASE_DIGITS_PLACEHOLDER = "Fractional Digits";
export const RELEASE_TICKER_FIELD = "Token Ticker";
const RELEASE_TICKER_PLACEHOLDER = "Token Ticker";

interface Props {
  readonly form: FormApi;
}

const ReleaseGuaranteeFunds = ({ form }: Props): JSX.Element => {
  return (
    <Block marginTop={2} display="flex" alignItems="center">
      <Typography>{AMOUNT_LABEL}</Typography>
      <Block marginLeft={2}>
        <TextFieldForm
          name={RELEASE_QUANTITY_FIELD}
          form={form}
          placeholder={RELEASE_QUANTITY_PLACEHOLDER}
          margin="none"
        />
      </Block>
      <Block marginLeft={2}>
        <TextFieldForm
          name={RELEASE_DIGITS_FIELD}
          form={form}
          placeholder={RELEASE_DIGITS_PLACEHOLDER}
          margin="none"
        />
      </Block>
      <Block marginLeft={2}>
        <TextFieldForm
          name={RELEASE_TICKER_FIELD}
          form={form}
          placeholder={RELEASE_TICKER_PLACEHOLDER}
          margin="none"
        />
      </Block>
    </Block>
  );
};

export default ReleaseGuaranteeFunds;
