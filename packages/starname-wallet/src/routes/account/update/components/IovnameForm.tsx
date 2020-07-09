import { Fee } from "@iov/bcp";
import { BillboardContext, FormValues, ToastContext, ToastVariant } from "medulas-react-components";
import React, { Dispatch, SetStateAction } from "react";
import { ErrorParser } from "ui-logic";

import { history } from "../../..";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import AccountEdit, { getChainAddressPairsFromValues } from "../../../../components/AccountEdit";
import { BwUsernameWithChainName } from "../../../../components/AccountManage";
import { ChainAddressPairWithName } from "../../../../components/AddressesTable";
import { IOVNAME_MANAGE_ROUTE } from "../../../paths";

export interface Props {
  readonly setTransactionId: Dispatch<SetStateAction<string | null>>;
  readonly rpcEndpoint: RpcEndpoint;
  readonly chainAddresses: readonly ChainAddressPairWithName[];
}

const IovnameAccountUpdate = ({ setTransactionId, rpcEndpoint, chainAddresses }: Props): JSX.Element => {
  const account: BwUsernameWithChainName = history.location.state;

  const onReturnToManage = (): void => {
    history.push(IOVNAME_MANAGE_ROUTE, account);
  };

  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

  const getFee = async (values: FormValues): Promise<Fee | undefined> => {
    /*const addressesToRegister = getChainAddressPairsFromValues(values, chainAddresses);

    return (await generateUpdateUsernameTxWithFee(bnsIdentity, account.username, addressesToRegister)).fee;*/
    return {} as Fee;
  };

  const onSubmit = async (values: object): Promise<void> => {
    if (!rpcEndpoint) throw Error("No rpcEndpoint found for submit");

    const formValues = values as FormValues;

    const addressesToRegister = getChainAddressPairsFromValues(formValues, chainAddresses);

    try {
      /*const request = await generateUpdateUsernameTxRequest(
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
      }*/
    } catch (error) {
      console.error(error);
      const message = ErrorParser.tryParseWeaveError(error) || "An unknown error occurred";
      toast.show(message, ToastVariant.ERROR);
    } finally {
      billboard.close();
    }
  };

  return (
    <AccountEdit
      chainAddresses={chainAddresses}
      account={account}
      onCancel={onReturnToManage}
      getFee={getFee}
      onSubmit={onSubmit}
    />
  );
};

export default IovnameAccountUpdate;
