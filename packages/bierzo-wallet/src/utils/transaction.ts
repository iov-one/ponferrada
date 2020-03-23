import { TransactionId } from "@iov/bcp";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { BillboardContextInterface, ToastContextInterface, ToastVariant } from "medulas-react-components";

import { RpcEndpoint } from "../communication/rpcEndpoint";

export async function submitTransaction(
  request: JsonRpcRequest,
  billboard: BillboardContextInterface,
  toast: ToastContextInterface,
  rpcEndpoint: RpcEndpoint,
  extensionBillboardMsg: React.ReactNode,
  ledgerBillboardMsg: React.ReactNode,
  setTransactionId: (transactionId: TransactionId) => void,
): Promise<void> {
  try {
    if (rpcEndpoint.type === "extension") {
      billboard.show(extensionBillboardMsg, "start", "flex-end", 0);
    } else {
      billboard.show(ledgerBillboardMsg, "center", "center", 0);
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
}
