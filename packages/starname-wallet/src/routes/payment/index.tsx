import { toHex } from "@cosmjs/encoding";
import { isUint8Array } from "@cosmjs/utils";
import { Address, SendTransaction, TokenTicker, TransactionId, TxCodec } from "@iov/bcp";
import { JsonRpcRequest, makeJsonRpcId } from "@iov/jsonrpc";
import { BillboardContext, FormValues, ToastContext, ToastVariant } from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";
import { ErrorParser, stringToAmount } from "ui-logic";

import { history } from "..";
import LedgerBillboardMessage from "../../components/BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "../../components/BillboardMessage/NeumaBillboardMessage";
import PageMenu from "../../components/PageMenu";
import { isIovname, lookupRecipientAddressByName } from "../../logic/account";
import { getCodecForChainId } from "../../logic/codec";
import { RootState } from "../../store/reducers";
import { BALANCE_ROUTE, TRANSACTIONS_ROUTE } from "../paths";
import Layout from "./components";
import ConfirmPayment from "./components/ConfirmPayment";
import { CURRENCY_FIELD, QUANTITY_FIELD } from "./components/CurrencyToSend";
import { ADDRESS_FIELD } from "./components/ReceiverAddress";
import { TEXTNOTE_FIELD } from "./components/TextNote";

function onCancelPayment(): void {
  history.push(BALANCE_ROUTE);
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
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);
  const rpcEndpoint = ReactRedux.useSelector((state: RootState) => state.rpcEndpoint);
  const [transactionId, setTransactionId] = React.useState<TransactionId | null>(null);
  const [selectedChainCodec, setSelectedChainCodec] = React.useState<TxCodec | null>(null);

  const onNewPayment = (): void => {
    setTransactionId(null);
  };

  /** Avoid
   *
   * Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your
   * application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
   *     in Payment (created by Context.Consumer)
   *
   * by deferring setSelectedChainCodec() to onSubmit, making onTokenSelectionChanged a no-op (and not a promise)
   **/
  const onTokenSelectionChanged = (ticker: TokenTicker): void => {
    /* no-op
    const token = tokens[ticker];
    if (token) {
      const chainId = token.chainId;
      setSelectedChainCodec(await getCodecForChainId(chainId));
    }
    */
  };

  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;

    const token = tokens[formValues[CURRENCY_FIELD] as TokenTicker];
    const amount = stringToAmount(formValues[QUANTITY_FIELD], token.token);

    const chainId = token.chainId;
    const codec = await getCodecForChainId(chainId);

    setSelectedChainCodec(codec);

    let recipient: Address;
    if (isIovname(formValues[ADDRESS_FIELD])) {
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

    const identity = identities.get(chainId);
    if (!identity) {
      toast.show("None of your identities can send on this chain", ToastVariant.ERROR);
      return;
    }

    if (!rpcEndpoint) throw new Error("RPC endpoint not set in redux store. This is a bug.");

    try {
      /** HACK: TODO: use
       * const request = await generateSendTxRequest(
       *   identity.identity,
       *   recipient,
       *   amount,
       *   formValues[TEXTNOTE_FIELD],
       * );
       */
      // HACK: don't try to debug @iov/encoding, just
      const prefixes = {
        string: "string:",
        bytes: "bytes:",
      };
      const toJson = (data: any): any => {
        if (typeof data === "number" || typeof data === "boolean") {
          return data;
        }
        if (data === null) {
          return null;
        }
        if (typeof data === "string") {
          return `${prefixes.string}${data}`;
        }
        if (isUint8Array(data)) {
          return `${prefixes.bytes}${toHex(data)}`;
        }
        if (Array.isArray(data)) {
          return data.map(toJson);
        }
        // Exclude special kind of objects like Array, Date or Uint8Array
        // Object.prototype.toString() returns a specified value:
        // http://www.ecma-international.org/ecma-262/7.0/index.html#sec-object.prototype.tostring
        if (
          typeof data === "object" &&
          data !== null &&
          Object.prototype.toString.call(data) === "[object Object]"
        ) {
          const out: any = {};
          for (const key of Object.keys(data)) {
            const value = data[key];
            // Skip dictionary entries with value `undefined`, just like native JSON:
            // > JSON.stringify({ foo: undefined })
            // '{}'
            if (value === undefined) continue;

            // super HACK: isUint8Array() is falling on Uint8Arrays
            if (key === "data") {
              // tslint:disable-next-line: no-object-mutation
              out[key] = `${prefixes.bytes}${toHex(value)}`;
            } else {
              // tslint:disable-next-line: no-object-mutation
              out[key] = toJson(value);
            }
          }
          return out;
        }
        throw new Error("Cannot encode type to JSON");
      };
      const sender = identity.identity;
      const senderAddress = codec.identityToAddress(sender);
      const transactionWithFee: SendTransaction = {
        kind: "bcp/send",
        chainId: sender.chainId,
        recipient,
        senderPubkey: sender.pubkey,
        sender: senderAddress,
        amount: amount,
        memo: formValues[TEXTNOTE_FIELD],
      };

      const request: JsonRpcRequest = {
        jsonrpc: "2.0",
        id: makeJsonRpcId(),
        method: "signAndPost",
        params: {
          reason: toJson("I would like you to sign this request"),
          signer: toJson(sender),
          transaction: toJson(transactionWithFee),
        },
      };

      if (rpcEndpoint.type === "extension") {
        billboard.show(
          <NeumaBillboardMessage text={rpcEndpoint.authorizeSignAndPostMessage} />,
          "start",
          "flex-end",
          0,
        );
      } else {
        billboard.show(
          <LedgerBillboardMessage text={rpcEndpoint.authorizeSignAndPostMessage} />,
          "center",
          "center",
          0,
        );
      }

      const transactionId = await rpcEndpoint.sendSignAndPostRequest(request);
      if (transactionId === undefined) {
        toast.show(rpcEndpoint.notAvailableMessage, ToastVariant.ERROR);
      } else if (transactionId === null) {
        toast.show("Request rejected", ToastVariant.ERROR);
      } else {
        setTransactionId(transactionId);
      }
    } catch (error) {
      console.error(error);
      const message = ErrorParser.tryParseWeaveError(error) || "An unknown error occurred";
      toast.show(message, ToastVariant.ERROR);
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
