import { Address, TokenTicker } from "@iov/bcp";
import { FormApi } from "final-form";
import {
  Block,
  SelectFieldForm,
  SelectFieldFormItem,
  TextFieldForm,
  Typography,
} from "medulas-react-components";
import React, { useEffect, useState } from "react";

import { getBnsConnection } from "../../../../logic/connection";

const AMOUNT_LABEL = "Amount";
export const RELEASE_QUANTITY_FIELD = "Quantity";
const RELEASE_QUANTITY_PLACEHOLDER = "0.00";
export const RELEASE_TICKER_FIELD = "Ticker";
const RELEASE_TICKER_INITIAL = "Select a currency";

interface Props {
  readonly form: FormApi;
}

const ReleaseGuaranteeFunds = ({ form }: Props): JSX.Element => {
  const [tickerItems, setTickerItems] = useState<SelectFieldFormItem[]>([]);

  useEffect(() => {
    const updateTickers = async (): Promise<void> => {
      // TODO: Calculate dynamically from guaranteeFundEscrowId using IOV-Core
      const guaranteeFundAddress = "tiov170qvwm0tscn5mza3vmaerkzqllvwc3kycrz6kr" as Address;

      const connection = await getBnsConnection();
      const account = await connection.getAccount({ address: guaranteeFundAddress });
      const tickers = account
        ? account.balance.map(balance => balance.tokenTicker)
        : new Array<TokenTicker>();

      const tickerItems = Object.values(tickers)
        .sort()
        .map((ticker): SelectFieldFormItem => ({ name: ticker }));

      setTickerItems(tickerItems);
    };

    updateTickers();
  }, []);

  return (
    <Block marginTop={2} display="flex" alignItems="center">
      <Typography>{AMOUNT_LABEL}</Typography>
      <Block marginLeft={2} display="flex" alignItems="center">
        <TextFieldForm
          name={RELEASE_QUANTITY_FIELD}
          form={form}
          placeholder={RELEASE_QUANTITY_PLACEHOLDER}
          margin="none"
        />
        <Block marginLeft={2}>
          <SelectFieldForm
            fieldName={RELEASE_TICKER_FIELD}
            form={form}
            items={tickerItems}
            initial={RELEASE_TICKER_INITIAL}
          />
        </Block>
      </Block>
    </Block>
  );
};

export default ReleaseGuaranteeFunds;
