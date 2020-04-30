import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import PageMenu from "../../components/PageMenu";
import { RootState } from "../../store/reducers";
import { getFirstUsername, getFirstUsernameWithNewChain } from "../../store/usernames/selectors";
import { IOVNAME_REGISTER_ROUTE } from "../paths";
import Layout from "./components";
import { BnsConnection } from "@iov/bns";
import { BillboardContext, ToastContext, ToastVariant } from "medulas-react-components";

import { ChainId, Identity, Address } from "@iov/bcp";
import { ExtendedIdentity } from "../../store/identities";
import { getConnectionForChainId } from "../../logic/connection";
import LedgerBillboardMessage from "../../components/BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "../../components/BillboardMessage/NeumaBillboardMessage";
import { generateUpdateUsernameTxRequest } from "../../communication/requestgenerators";

function onRegisterIovname(): void {
  history.push(IOVNAME_REGISTER_ROUTE);
}

export function getBnsIdentity(identities: ReadonlyMap<ChainId, ExtendedIdentity>): Identity | undefined {
  for (const identity of Array.from(identities.values()).map(ext => ext.identity)) {
    if (getConnectionForChainId(identity.chainId) instanceof BnsConnection) {
      return identity;
    }
  }
  return undefined;
}

const Balance = (): JSX.Element => {
  const tokens = ReactRedux.useSelector((state: RootState) => state.balances);
  const bnsUsername = ReactRedux.useSelector(getFirstUsername);
  const bnsUsernameWithNewChain = ReactRedux.useSelector(getFirstUsernameWithNewChain);
  const iovAddress = bnsUsername ? bnsUsername.username : undefined;
  const iovAddressWithNewChain = bnsUsernameWithNewChain ? bnsUsernameWithNewChain.username : undefined;
  const rpcEndpoint = ReactRedux.useSelector((state: RootState) => state.rpcEndpoint);
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);
  const bnsIdentity = getBnsIdentity(identities);
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

  const onUpgradeIovname = async (): Promise<void> => {
    if (!bnsIdentity) throw Error("No bnsIdentity found for submit");
    if (!rpcEndpoint) throw Error("No rpcEndpoint found for submit");

    //const formValues = values as FormValues;

    //const addressesToRegister = getChainAddressPairsFromValues(formValues, chainAddresses);

    try {
      const request = await generateUpdateUsernameTxRequest(bnsIdentity, "antoine*iov", [
        {
          chainId: "cosmos:cosmoshub-3" as ChainId,
          address: "cosmos1ylz6tqpgz0flpl6h5szmj6mmzyr598rqe3908y" as Address,
        },
        {
          chainId: "bip122:000000000019d6689c085ae165831e93" as ChainId, // bitcoin
          address: "3QJev38iDbvdaM4DoWkGoKyQTYAXv812RY" as Address,
        },
      ]);

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
        // looks good
        // setTransactionId(transactionId);
      }
    } catch (error) {
      console.error(error);
      // const message = ErrorParser.tryParseWeaveError(error) || "An unknown error occurred";
      toast.show("error", ToastVariant.ERROR);
    } finally {
      billboard.close();
    }
  };

  return (
    <PageMenu>
      <Layout
        onRegisterIovname={onRegisterIovname}
        onUpgradeIovname={onUpgradeIovname}
        balances={tokens}
        iovAddress={iovAddress}
        iovAddressWithNewChain={iovAddressWithNewChain}
      />
    </PageMenu>
  );
};

export default Balance;
