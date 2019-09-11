import { ChainId, TokenTicker } from "@iov/bcp";
import { escrowIdToAddress } from "@iov/bns";
import { Encoding } from "@iov/encoding";
import { FormApi } from "final-form";
import {
  Block,
  composeValidators,
  FieldInputValue,
  greaterOrEqualThan,
  lowerOrEqualThan,
  required,
  SelectFieldForm,
  SelectFieldFormItem,
  TextFieldForm,
  Typography,
} from "medulas-react-components";
import React, { useEffect, useState } from "react";

import { getConfig } from "../../../../config";
import { getBnsConnection } from "../../../../logic/connection";

const AMOUNT_LABEL = "Amount";
export const RELEASE_QUANTITY_FIELD = "Quantity";
const RELEASE_QUANTITY_PLACEHOLDER = "1";
export const RELEASE_TICKER_FIELD = "Ticker";
const RELEASE_TICKER_INITIAL = "Select a currency";

interface Props {
  readonly form: FormApi;
}

const ReleaseGuaranteeFunds = ({ form }: Props): JSX.Element => {
  const [tickerItems, setTickerItems] = useState<SelectFieldFormItem[]>([]);

  useEffect(() => {
    const updateTickers = async (): Promise<void> => {
      const config = await getConfig();
      const escrowHex = config.bnsChain.guaranteeFundEscrowId;
      if (!escrowHex) throw Error("No Escrow ID provided. This is a bug.");
      const guaranteeFundEscrowId = Encoding.fromHex(escrowHex);

      const chainId = config.bnsChain.chainId as ChainId;
      if (!chainId) throw Error("No Chain ID provided. This is a bug.");
      const guaranteeFundAddress = escrowIdToAddress(chainId, guaranteeFundEscrowId);

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

  const numbersOnly = (value: FieldInputValue): string | undefined => {
    if (typeof value !== "string") throw new Error("Input must be a string");

    const hasNonNumbers = value.search(new RegExp("[^0-9]")) === 1 ? true : false;

    if (hasNonNumbers) return "Must be a number";
    return undefined;
  };

  const quantityValidator = composeValidators(
    required,
    numbersOnly,
    greaterOrEqualThan(1),
    lowerOrEqualThan(1e33),
  );

  const tickerValidator = (value: FieldInputValue): string | undefined => {
    if (value === RELEASE_TICKER_INITIAL) return "Must select a currency";
    return undefined;
  };

  return (
    <Block marginTop={2} display="flex" alignItems="center">
      <Typography>{AMOUNT_LABEL}</Typography>
      <Block marginLeft={2} display="flex" alignItems="center">
        <TextFieldForm
          name={RELEASE_QUANTITY_FIELD}
          form={form}
          validate={quantityValidator}
          placeholder={RELEASE_QUANTITY_PLACEHOLDER}
          margin="none"
        />
        <Block marginLeft={2}>
          <SelectFieldForm
            fieldName={RELEASE_TICKER_FIELD}
            form={form}
            validate={tickerValidator}
            items={tickerItems}
            initial={RELEASE_TICKER_INITIAL}
          />
        </Block>
      </Block>
    </Block>
  );
};

export default ReleaseGuaranteeFunds;
