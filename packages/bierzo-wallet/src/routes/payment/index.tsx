import { Address, TokenTicker, TransactionId, TxCodec } from "@iov/bcp";
import { BillboardContext, FormValues, ToastContext, ToastVariant } from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";
import { stringToAmount } from "ui-logic";

import { history } from "..";
import { generateSendTxRequest, sendSignAndPostRequest } from "../../communication/signAndPost";
import BillboardMessage from "../../components/BillboardMessage";
import PageMenu from "../../components/PageMenu";
import { isIov, lookupRecipientAddressByName } from "../../logic/account";
import { getCodecForChainId } from "../../logic/codec";
import { RootState } from "../../store/reducers";
import { BALANCE_ROUTE, PAYMENT_ROUTE, TRANSACTIONS_ROUTE } from "../paths";
import Layout from "./components";
import ConfirmPayment from "./components/ConfirmPayment";
import { CURRENCY_FIELD, QUANTITY_FIELD } from "./components/CurrencyToSend";
import { ADDRESS_FIELD } from "./components/ReceiverAddress";
import { TEXTNOTE_FIELD } from "./components/TextNote";

function onCancelPayment(): void {
  history.push(BALANCE_ROUTE);
}
function onNewPayment(): void {
  history.push(PAYMENT_ROUTE);
}
function onSeeTrasactions(): void {
  history.push(TRANSACTIONS_ROUTE);
}
function onReturnToBalance(): void {
  history.push(BALANCE_ROUTE);
}

const Payment = (): JSX.Element => {
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);
  const tokens = ReactRedux.useSelector((state: RootState) => state.tokens);
  const identities = ReactRedux.useSelector((state: RootState) => state.extension.identities);
  const [transactionId, setTransactionId] = React.useState<TransactionId | null>(null);
  const [selectedChainCodec, setSelectedChainCodec] = React.useState<TxCodec | null>(null);

  const onTokenSelectionChanged = async (ticker: TokenTicker): Promise<void> => {
    const token = tokens[ticker];
    if (token) {
      const chainId = token.chainId;
      setSelectedChainCodec(await getCodecForChainId(chainId));
    }
  };

  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;

    const token = tokens[formValues[CURRENCY_FIELD] as TokenTicker];
    const amount = stringToAmount(formValues[QUANTITY_FIELD], token.token);

    const chainId = token.chainId;

    let recipient: Address;
    if (isIov(formValues[ADDRESS_FIELD])) {
      const lookupResult = await lookupRecipientAddressByName(formValues[ADDRESS_FIELD], chainId);

      if (lookupResult === "name_not_found") {
        toast.show("Recipient's personalized address was not found", ToastVariant.ERROR);
        return;
      } else if (lookupResult === "no_address_for_blockchain") {
        toast.show(
          "Recipient's personalized address does not contain an address for this blockchain",
          ToastVariant.ERROR,
        );
        return;
      }
      recipient = lookupResult;
    } else {
      recipient = formValues[ADDRESS_FIELD] as Address;
    }

    const identity = identities[chainId];
    if (!identity) {
      toast.show("None of your identities can send on this chain", ToastVariant.ERROR);
      return;
    }

    try {
      const request = await generateSendTxRequest(identity, recipient, amount, formValues[TEXTNOTE_FIELD]);
      billboard.show(<BillboardMessage />);
      const transactionId = await sendSignAndPostRequest(request);
      if (transactionId === null) {
        toast.show("Request rejected", ToastVariant.ERROR);
      } else {
        setTransactionId(transactionId);
      }
    } catch (error) {
      console.error(error);
      toast.show("An error ocurred", ToastVariant.ERROR);
      return;
    } finally {
      billboard.close();
    }
  };

  return (
    <PageMenu>
      {transactionId ? (
        <ConfirmPayment
          transactionId={transactionId}
          onNewPayment={onNewPayment}
          onSeeTrasactions={onSeeTrasactions}
          onReturnToBalance={onReturnToBalance}
        />
      ) : (
        <Layout
          onCancelPayment={onCancelPayment}
          onSubmit={onSubmit}
          onTokenSelectionChanged={onTokenSelectionChanged}
          selectedChainCodec={selectedChainCodec}
        />
      )}
    </PageMenu>
  );
};

export default Payment;
