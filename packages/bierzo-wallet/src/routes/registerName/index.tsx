import { Identity } from "@iov/bcp";
import { BnsConnection, ChainAddressPair } from "@iov/bns";
import { TransactionEncoder } from "@iov/encoding";
import { FormValues, ValidationError } from "medulas-react-components/lib/components/forms/Form";
import { ToastContext } from "medulas-react-components/lib/context/ToastProvider";
import { ToastVariant } from "medulas-react-components/lib/context/ToastProvider/Toast";
import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { generateRegisterUsernameTxRequest, sendSignAndPostRequest } from "../../communication/signAndPost";
import PageMenu from "../../components/PageMenu";
import { getConnectionForBns, getConnectionForChainId } from "../../logic/connection";
import { RootState } from "../../store/reducers";
import { addUsernamesAction, getUsernames } from "../../store/usernames";
import { sleep } from "../../utils/timer";
import { getChainAddressPair } from "../../utils/tokens";
import { BALANCE_ROUTE } from "../paths";
import Layout, { REGISTER_USERNAME_FIELD } from "./components";

function onCancel(): void {
  history.push(BALANCE_ROUTE);
}

const validate = async (values: object): Promise<object> => {
  const formValues = values as FormValues;
  const errors: ValidationError = {};

  const username = formValues[REGISTER_USERNAME_FIELD];
  if (!username || username.length === 0) {
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
  const dispatch = ReactRedux.useDispatch();

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

      await sleep(5000);
      const usernames = await getUsernames(pubKeys);
      dispatch(addUsernamesAction(usernames));
      history.push(BALANCE_ROUTE);
    } catch (error) {
      console.error(error);
      toast.show("An error ocurred", ToastVariant.ERROR);
      return;
    }
  };

  return (
    <PageMenu>
      <Layout onSubmit={onSubmit} validate={validate} onCancel={onCancel} addresses={addresses} />
    </PageMenu>
  );
};

export default RegisterUsername;
