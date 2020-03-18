import { Address, Fee, Identity, TransactionId } from "@iov/bcp";
import { BillboardContext, FormValues, ToastContext, ToastVariant } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import {
  generateTransferUsernameTxRequest,
  generateTransferUsernameTxWithFee,
} from "../../../../communication/requestgenerators";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import { BwUsernameWithChainName } from "../../../../components/AccountManage";
import AccountTransfer, { RECEPIENT_ADDRESS } from "../../../../components/AccountTransfer";
import LedgerBillboardMessage from "../../../../components/BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "../../../../components/BillboardMessage/NeumaBillboardMessage";
import { isValidName, lookupRecipientAddressByName } from "../../../../logic/account";
import { IOVNAME_MANAGE_ROUTE } from "../../../paths";

const IOVNAME_TRANSFER_ID = "iovname-transfer-id";

export async function getAccountTransferFee(
  bnsIdentity: Identity,
  username: string,
  newOwner: Address,
): Promise<Fee | undefined> {
  const transactionWithFee = await generateTransferUsernameTxWithFee(bnsIdentity, username, newOwner);

  return transactionWithFee.fee;
}

interface Props {
  readonly bnsIdentity: Identity;
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<TransactionId | null>>;
}

const IovnameAccountTransfer = ({ setTransactionId, bnsIdentity, rpcEndpoint }: Props): JSX.Element => {
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

  const account: BwUsernameWithChainName = history.location.state;

  const onReturnToManage = (): void => {
    history.push(IOVNAME_MANAGE_ROUTE, account);
  };

  const getFee = async (newOwner: Address): Promise<Fee | undefined> => {
    return await getAccountTransferFee(bnsIdentity, account.username, newOwner);
  };

  const onTransfer = async (values: object): Promise<void> => {
    const formValues = values as FormValues;

    let newOwner: Address = formValues[RECEPIENT_ADDRESS] as Address;
    if (isValidName(newOwner) === "valid") {
      const lookupResult = await lookupRecipientAddressByName(newOwner, bnsIdentity.chainId);
      newOwner = lookupResult as Address;
    }

    try {
      const request = await generateTransferUsernameTxRequest(bnsIdentity, account.username, newOwner);
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
    <AccountTransfer
      id={IOVNAME_TRANSFER_ID}
      onCancel={onReturnToManage}
      account={account}
      onTransfer={onTransfer}
      getFee={getFee}
    />
  );
};

export default IovnameAccountTransfer;

// clay design suit town spoil pond among sand swap roof license hand
// tiov1ar2nnfd8zzp3c4d28w6aukxlt80y3hy0y42ly7

// enforce slight dice song slush extend cool wrist short civil album crush
// tiov1k59l3mfe0h5zaws95zuy3esuyea22y00vpkd7e
