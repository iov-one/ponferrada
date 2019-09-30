import { ChainId, TokenTicker } from "@iov/bcp";
import { escrowIdToAddress } from "@iov/bns";
import { Decimal } from "@iov/encoding";
import { FormApi } from "final-form";
import {
  Block,
  composeValidators,
  FieldInputValue,
  required,
  SelectField,
  SelectFieldItem,
  TextField,
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
  readonly initialTickers?: readonly TokenTicker[];
}

const ReleaseGuaranteeFunds = ({ form, initialTickers }: Props): JSX.Element => {
  const [tickers, setTickers] = useState<readonly TokenTicker[]>(initialTickers || []);

  useEffect(() => {
    const updateTickers = async (): Promise<void> => {
      const config = await getConfig();
      const guaranteeFundEscrowId = config.bnsChain.guaranteeFundEscrowId;
      if (guaranteeFundEscrowId === undefined) throw Error("No Escrow ID provided. This is a bug.");

      const chainId = config.bnsChain.chainSpec.chainId as ChainId;
      const guaranteeFundAddress = escrowIdToAddress(chainId, guaranteeFundEscrowId);

      const connection = await getBnsConnection();
      const account = await connection.getAccount({ address: guaranteeFundAddress });

      const tickers = account
        ? account.balance.map(balance => balance.tokenTicker)
        : new Array<TokenTicker>();
      tickers.sort();

      setTickers(tickers);
    };

    updateTickers();
  }, []);

  const decimalOnly = (value: FieldInputValue): string | undefined => {
    if (typeof value !== "string") throw new Error("Input must be a string");

    try {
      Decimal.fromUserInput(value, 9);
    } catch {
      return "Must be a decimal";
    }

    return undefined;
  };

  const quantityValidator = composeValidators(required, decimalOnly);

  const tickerValidator = (value: FieldInputValue): string | undefined => {
    if (value === RELEASE_TICKER_INITIAL) return "Must select a currency";
    return undefined;
  };

  return (
    <Block marginTop={2} display="flex" alignItems="center">
      <Typography>{AMOUNT_LABEL}</Typography>
      <Block marginLeft={2} display="flex" alignItems="center">
        <TextField
          name={RELEASE_QUANTITY_FIELD}
          form={form}
          validate={quantityValidator}
          placeholder={RELEASE_QUANTITY_PLACEHOLDER}
          margin="none"
        />
        <Block marginLeft={2}>
          <SelectField
            fieldName={RELEASE_TICKER_FIELD}
            form={form}
            validate={tickerValidator}
            items={tickers.map((ticker): SelectFieldItem => ({ name: ticker }))}
            initial={RELEASE_TICKER_INITIAL}
          />
        </Block>
      </Block>
    </Block>
  );
};

export default ReleaseGuaranteeFunds;
