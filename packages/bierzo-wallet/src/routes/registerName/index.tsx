import { Identity } from "@iov/bcp";
import { ChainAddressPair } from "@iov/bns";
import { TransactionEncoder } from "@iov/encoding";
import { FormValues } from "medulas-react-components/lib/components/forms/Form";
import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { generateRegisterUsernameTxRequest, sendSignAndPostRequest } from "../../communication/signAndPost";
import PageMenu from "../../components/PageMenu";
import { getCodecForChainId } from "../../logic/codec";
import { RootState } from "../../store/reducers";
import { BALANCE_ROUTE } from "../paths";
import Layout, { SET_USERNAME_FIELD } from "./components";

function onCancel(): void {
  history.push(BALANCE_ROUTE);
}

const RegisterUsername = (): JSX.Element => {
  const pubKeys = ReactRedux.useSelector((state: RootState) => state.extension.keys);
  async function onSubmit(values: object): Promise<void> {
    const formValues = values as FormValues;

    const username = formValues[SET_USERNAME_FIELD];

    let bnsIdentity: Identity;
    const addresses: ChainAddressPair[] = [];
    for (const key of Object.values(pubKeys)) {
      const identity: Identity = TransactionEncoder.fromJson(JSON.parse(key));
      if (identity) {
      }
      addresses.push({
        chainId: identity.chainId,
        address: (await getCodecForChainId(identity.chainId)).identityToAddress(identity),
      });
    }
    try {
      const request = await generateRegisterUsernameTxRequest(bnsIdentity, username, addresses);
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
    }
  }

  return (
    <PageMenu>
      <Layout onSubmit={onSubmit} onCancel={onCancel} />
    </PageMenu>
  );
};

export default RegisterUsername;
