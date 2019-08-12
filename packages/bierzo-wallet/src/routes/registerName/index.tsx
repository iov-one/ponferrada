import { Identity, TransactionId } from "@iov/bcp";
import { BnsConnection, ChainAddressPair } from "@iov/bns";
import { TransactionEncoder } from "@iov/encoding";
import { FormValues, ToastContext, ToastVariant, ValidationError } from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { generateRegisterUsernameTxRequest, sendSignAndPostRequest } from "../../communication/signAndPost";
import PageMenu from "../../components/PageMenu";
import { getConnectionForBns, getConnectionForChainId } from "../../logic/connection";
import { RootState } from "../../store/reducers";
import { getChainAddressPair } from "../../utils/tokens";
import { BALANCE_ROUTE, TRANSACTIONS_ROUTE } from "../paths";
import Layout, { REGISTER_USERNAME_FIELD } from "./components";
import ConfirmRegistration from "./components/ConfirmRegistration";

function onSeeTrasactions(): void {
  history.push(TRANSACTIONS_ROUTE);
}
function onReturnToBalance(): void {
  history.push(BALANCE_ROUTE);
}

const validate = async (values: object): Promise<object> => {
  const formValues = values as FormValues;
  const errors: ValidationError = {};

  const username = formValues[REGISTER_USERNAME_FIELD];
  if (!username) {
    errors[REGISTER_USERNAME_FIELD] = "Required";
    return errors;
  }

  if (!username.endsWith("*iov")) {
    errors[REGISTER_USERNAME_FIELD] = "Username must include namespace suffix";
    return errors;
  }

  const connection = await getConnectionForBns();
  const usernames = await connection.getUsernames({ username });
  if (usernames.length > 0) {
    errors[REGISTER_USERNAME_FIELD] = "Username already exists";
  }
  return errors;
};

const RegisterUsername = (): JSX.Element => {
  const [addresses, setAddresses] = React.useState<ChainAddressPair[]>([]);
  const toast = React.useContext(ToastContext);
  const pubKeys = ReactRedux.useSelector((state: RootState) => state.extension.keys);
  const [transactionId, setTransactionId] = React.useState<TransactionId | null>(null);

  React.useEffect(() => {
    async function processPubKeys(pubKeys: { [chain: string]: string }): Promise<void> {
      setAddresses(await getChainAddressPair(pubKeys));
    }

    processPubKeys(pubKeys);
  }, [pubKeys]);

  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;

    const username = formValues[REGISTER_USERNAME_FIELD];
    let bnsIdentity: Identity | null = null;
    for (const address of addresses) {
      if ((await getConnectionForChainId(address.chainId)) instanceof BnsConnection) {
        bnsIdentity = TransactionEncoder.fromJson(JSON.parse(pubKeys[address.chainId]));
      }
    }

    if (!bnsIdentity) {
      toast.show("No BNS identity available", ToastVariant.ERROR);
      return;
    }

    try {
      const request = await generateRegisterUsernameTxRequest(bnsIdentity, username, addresses);
      const transactionId = await sendSignAndPostRequest(request);
      if (transactionId === null) {
        toast.show("Request rejected", ToastVariant.ERROR);
      }
      setTransactionId(transactionId);
    } catch (error) {
      console.error(error);
      toast.show("An error ocurred", ToastVariant.ERROR);
      return;
    }
  };

  return (
    <PageMenu>
      {transactionId ? (
        <ConfirmRegistration
          transactionId={transactionId}
          onSeeTrasactions={onSeeTrasactions}
          onReturnToBalance={onReturnToBalance}
        />
      ) : (
        <Layout onSubmit={onSubmit} validate={validate} onCancel={onReturnToBalance} addresses={addresses} />
      )}
    </PageMenu>
  );
};

export default RegisterUsername;
