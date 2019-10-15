import { Identity, TransactionId } from "@iov/bcp";
import { BnsConnection } from "@iov/bns";
import {
  BillboardContext,
  FormValues,
  ToastContext,
  ToastVariant,
  ValidationError,
} from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { generateRegisterUsernameTxRequest } from "../../communication/requestgenerators";
import BillboardMessage from "../../components/BillboardMessage";
import LedgerBillboardMessage from "../../components/BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "../../components/BillboardMessage/NeumaBillboardMessage";
import PageMenu from "../../components/PageMenu";
import { isValidIov } from "../../logic/account";
import { getConnectionForBns, getConnectionForChainId } from "../../logic/connection";
import { RootState } from "../../store/reducers";
import { getChainAddressPairWithNames } from "../../utils/tokens";
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

  const checkResult = isValidIov(username);

  switch (checkResult) {
    case "not_iov":
      errors[REGISTER_USERNAME_FIELD] = "Personalized address must include namespace suffix";
      break;
    case "wrong_number_of_asterisks":
      errors[REGISTER_USERNAME_FIELD] = "Personalized address must include only one namespace suffix";
      break;
    case "too_short":
      errors[REGISTER_USERNAME_FIELD] = "Personalized address should be at least 3 characters";
      break;
    case "too_long":
      errors[REGISTER_USERNAME_FIELD] = "Personalized address should be maximum 64 characters";
      break;
    case "wrong_chars":
      errors[REGISTER_USERNAME_FIELD] =
        "Personalized address should contain 'abcdefghijklmnopqrstuvwxyz0123456789-_.' characters only";
      break;
    case "valid":
      break;
    default:
      throw new Error(`"Unknown IOV personalized address validation error: ${checkResult}`);
  }

  if (checkResult !== "valid") {
    return errors;
  }

  const connection = await getConnectionForBns();
  const usernames = await connection.getUsernames({ username });
  if (usernames.length > 0) {
    errors[REGISTER_USERNAME_FIELD] = "Personalized address already exists";
  }
  return errors;
};

const RegisterUsername = (): JSX.Element => {
  const [transactionId, setTransactionId] = React.useState<TransactionId | null>(null);

  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

  const rpcEndpoint = ReactRedux.useSelector((state: RootState) => state.rpcEndpoint);
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);
  const addresses = getChainAddressPairWithNames(identities);

  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;

    const username = formValues[REGISTER_USERNAME_FIELD];
    let bnsIdentity: Identity | undefined;
    for (const identity of Array.from(identities.values()).map(ext => ext.identity)) {
      if ((await getConnectionForChainId(identity.chainId)) instanceof BnsConnection) {
        bnsIdentity = identity;
      }
    }

    if (!bnsIdentity) {
      toast.show("No BNS identity available", ToastVariant.ERROR);
      return;
    }

    if (!rpcEndpoint) throw new Error("RPC endpoint not set in redux store. This is a bug.");

    try {
      const request = await generateRegisterUsernameTxRequest(bnsIdentity, username, addresses);
      if (rpcEndpoint.type === "extension") {
        billboard.show(<NeumaBillboardMessage />, "start", "flex-end");
      } else {
        billboard.show(<LedgerBillboardMessage />, "center", "center");
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
      toast.show("An error occurred", ToastVariant.ERROR);
    } finally {
      billboard.close();
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
        <Layout
          onSubmit={onSubmit}
          validate={validate}
          onCancel={onReturnToBalance}
          chainAddresses={addresses}
        />
      )}
    </PageMenu>
  );
};

export default RegisterUsername;
