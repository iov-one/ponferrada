import { ChainId, Fee, Identity, TransactionId } from "@iov/bcp";
import { BnsConnection } from "@iov/bns";
import { BillboardContext, FormValues, ToastContext, ToastVariant } from "medulas-react-components";
import React, { Dispatch, SetStateAction } from "react";

import { history } from "../../..";
import { generateUpdateUsernameTxRequest } from "../../../../communication/requestgenerators";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import AccountEdit, { getChainAddressPairsFromValues } from "../../../../components/AccountEdit";
import { BwUsernameWithChainName } from "../../../../components/AccountManage";
import { ChainAddressPairWithName } from "../../../../components/AddressesTable";
import LedgerBillboardMessage from "../../../../components/BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "../../../../components/BillboardMessage/NeumaBillboardMessage";
import { getConnectionForChainId } from "../../../../logic/connection";
import { ExtendedIdentity } from "../../../../store/identities";
import { IOVNAME_MANAGE_ROUTE } from "../../../paths";

export function getBnsIdentity(identities: ReadonlyMap<ChainId, ExtendedIdentity>): Identity | undefined {
  for (const identity of Array.from(identities.values()).map(ext => ext.identity)) {
    if (getConnectionForChainId(identity.chainId) instanceof BnsConnection) {
      return identity;
    }
  }
  return undefined;
}

export interface Props {
  readonly setTransactionId: Dispatch<SetStateAction<TransactionId | null>>;
  readonly transactionFee: Fee | undefined;
  readonly rpcEndpoint: RpcEndpoint;
  readonly chainAddresses: readonly ChainAddressPairWithName[];
  readonly bnsIdentity: Identity;
}

const IovnameAccountUpdate = ({
  setTransactionId,
  transactionFee,
  rpcEndpoint,
  bnsIdentity,
  chainAddresses,
}: Props): JSX.Element => {
  const account: BwUsernameWithChainName = history.location.state;

  const onReturnToManage = (): void => {
    history.push(IOVNAME_MANAGE_ROUTE, account);
  };

  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

  const onSubmit = async (values: object): Promise<void> => {
    if (!bnsIdentity) throw Error("No bnsIdentity found for submit");
    if (!rpcEndpoint) throw Error("No rpcEndpoint found for submit");

    const formValues = values as FormValues;

    const addressesToRegister = getChainAddressPairsFromValues(formValues, chainAddresses);

    try {
      const request = await generateUpdateUsernameTxRequest(
        bnsIdentity,
        account.username,
        addressesToRegister,
      );

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
      toast.show("An error occurred", ToastVariant.ERROR);
    } finally {
      billboard.close();
    }
  };

  return (
    <AccountEdit
      chainAddresses={chainAddresses}
      account={account}
      onCancel={onReturnToManage}
      transactionFee={transactionFee}
      onSubmit={onSubmit}
    />
  );
};

export default IovnameAccountUpdate;
