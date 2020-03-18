import { Address, Fee, Identity, TransactionId } from "@iov/bcp";
import { BillboardContext, FormValues, ToastContext, ToastVariant } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import {
  generateTransferDomainTxRequest,
  generateTransferDomainTxWithFee,
} from "../../../../communication/requestgenerators";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import { BwAccountWithChainName } from "../../../../components/AccountManage";
import AccountTransfer, { RECEPIENT_ADDRESS } from "../../../../components/AccountTransfer";
import LedgerBillboardMessage from "../../../../components/BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "../../../../components/BillboardMessage/NeumaBillboardMessage";
import { isValidName, lookupRecipientAddressByName } from "../../../../logic/account";
import { STARNAME_MANAGE_ROUTE } from "../../../paths";

const STARNAME_TRANSFER_ID = "starname-transfer-id";

export async function getAccountTransferFee(
  bnsIdentity: Identity,
  username: string,
  newOwner: Address,
): Promise<Fee | undefined> {
  const transactionWithFee = await generateTransferDomainTxWithFee(bnsIdentity, username, newOwner);

  return transactionWithFee.fee;
}

interface Props {
  readonly bnsIdentity: Identity;
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<TransactionId | null>>;
}

const StarnameAccountTransfer = ({ setTransactionId, bnsIdentity, rpcEndpoint }: Props): JSX.Element => {
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

  const account: BwAccountWithChainName = history.location.state;

  const onReturnToManage = (): void => {
    history.push(STARNAME_MANAGE_ROUTE, account);
  };

  const getFee = async (newOwner: Address): Promise<Fee | undefined> => {
    return (await generateTransferDomainTxWithFee(bnsIdentity, account.domain, newOwner)).fee;
  };

  const onTransfer = async (values: object): Promise<void> => {
    const formValues = values as FormValues;

    let newOwner: Address = formValues[RECEPIENT_ADDRESS] as Address;
    if (isValidName(newOwner) === "valid") {
      const lookupResult = await lookupRecipientAddressByName(newOwner, bnsIdentity.chainId);
      newOwner = lookupResult as Address;
    }

    try {
      const request = await generateTransferDomainTxRequest(bnsIdentity, account.domain, newOwner);
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
      id={STARNAME_TRANSFER_ID}
      onCancel={onReturnToManage}
      account={account}
      onTransfer={onTransfer}
      getFee={getFee}
    />
  );
};

export default StarnameAccountTransfer;
