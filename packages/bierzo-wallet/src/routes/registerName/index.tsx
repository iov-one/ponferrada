import { Identity } from "@iov/bcp";
import { BnsConnection, ChainAddressPair } from "@iov/bns";
import { TransactionEncoder } from "@iov/encoding";
import { FormValues } from "medulas-react-components/lib/components/forms/Form";
import { ToastContext } from "medulas-react-components/lib/context/ToastProvider";
import { ToastVariant } from "medulas-react-components/lib/context/ToastProvider/Toast";
import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { generateRegisterUsernameTxRequest, sendSignAndPostRequest } from "../../communication/signAndPost";
import PageMenu from "../../components/PageMenu";
import { getCodecForChainId } from "../../logic/codec";
import { getConnectionForChainId } from "../../logic/connection";
import { RootState } from "../../store/reducers";
import { BALANCE_ROUTE } from "../paths";
import Layout, { SET_USERNAME_FIELD } from "./components";

function onCancel(): void {
  history.push(BALANCE_ROUTE);
}

const RegisterUsername = (): JSX.Element => {
  const toast = React.useContext(ToastContext);
  const pubKeys = ReactRedux.useSelector((state: RootState) => state.extension.keys);
  async function onSubmit(values: object): Promise<void> {
    const formValues = values as FormValues;

    const username = formValues[SET_USERNAME_FIELD];

    let bnsIdentity: Identity | null = null;
    const addresses: ChainAddressPair[] = [];
    for (const key of Object.values(pubKeys)) {
      const identity: Identity = TransactionEncoder.fromJson(JSON.parse(key));
      if (getConnectionForChainId(identity.chainId) instanceof BnsConnection) {
        bnsIdentity = identity;
      }
      addresses.push({
        chainId: identity.chainId,
        address: (await getCodecForChainId(identity.chainId)).identityToAddress(identity),
      });
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

      toast.show("Succesfully created", ToastVariant.ERROR);
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
