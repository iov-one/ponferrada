import { Address, Identity, TokenTicker, TransactionId, TxCodec } from "@iov/bcp";
import { TransactionEncoder } from "@iov/encoding";
import { FormValues } from "medulas-react-components/lib/components/forms/Form";
import { ToastContext } from "medulas-react-components/lib/context/ToastProvider";
import { ToastVariant } from "medulas-react-components/lib/context/ToastProvider/Toast";
import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { sendSignAndPostRequest } from "../../communication/signAndPost";
import PageMenu from "../../components/PageMenu";
import { isIov, lookupRecipientAddressByName } from "../../logic/account";
import { getCodecForChainId } from "../../logic/codec";
import { RootState } from "../../store/reducers";
import { padAmount, stringToAmount } from "../../utils/balances";
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
  const toast = React.useContext(ToastContext);
  const tokens = ReactRedux.useSelector((state: RootState) => state.tokens);
  const pubKeys = ReactRedux.useSelector((state: RootState) => state.extension.keys);
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

    const ticker = formValues[CURRENCY_FIELD] as TokenTicker;
    const amount = stringToAmount(formValues[QUANTITY_FIELD], ticker);
    const token = tokens[ticker];
    const chainId = token.chainId;
    const tokenAmount = padAmount(amount, token.token.fractionalDigits);

    let recipient: Address | undefined;
    if (isIov(formValues[ADDRESS_FIELD])) {
      recipient = await lookupRecipientAddressByName(
        formValues[ADDRESS_FIELD].replace(/\*iov$/, ""),
        chainId,
      );

      if (!recipient) {
        toast.show("IOV username was not found", ToastVariant.ERROR);
        return;
      }
    } else {
      recipient = formValues[ADDRESS_FIELD] as Address;
    }

    const plainPubkey = pubKeys[chainId];
    if (!plainPubkey) {
      toast.show("None of your identities can send on this chain", ToastVariant.ERROR);
      return;
    }

    const identity: Identity = TransactionEncoder.fromJson(JSON.parse(plainPubkey));

    try {
      const transactionId = await sendSignAndPostRequest(
        chainId,
        identity,
        recipient,
        tokenAmount,
        formValues[TEXTNOTE_FIELD],
      );
      if (transactionId === null) {
        toast.show("Request rejected", ToastVariant.ERROR);
      } else {
        setTransactionId(transactionId);
      }
    } catch (error) {
      console.error(error);
      toast.show("An error ocurred", ToastVariant.ERROR);
      return;
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
