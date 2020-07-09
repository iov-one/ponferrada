import { BillboardContextInterface, ToastContextInterface, ToastVariant } from "medulas-react-components";
import { ErrorParser } from "ui-logic";

import { RpcEndpoint } from "../communication/rpcEndpoint";

export async function submitTransaction(
  request: any,
  billboard: BillboardContextInterface,
  toast: ToastContextInterface,
  rpcEndpoint: RpcEndpoint,
  extensionBillboardMsg: React.ReactNode,
  ledgerBillboardMsg: React.ReactNode,
  setTransactionId: (transactionId: string) => void,
): Promise<void> {
  try {
    if (rpcEndpoint.type === "extension") {
      billboard.show(extensionBillboardMsg, "start", "flex-end", 0);
    } else {
      billboard.show(ledgerBillboardMsg, "center", "center", 0);
    }
    const transactionId = await rpcEndpoint.executeRequest(request);
    if (transactionId === undefined) {
      toast.show(rpcEndpoint.notAvailableMessage, ToastVariant.ERROR);
    } else if (transactionId === null) {
      toast.show("Request rejected", ToastVariant.ERROR);
    } else {
      setTransactionId(transactionId);
    }
  } catch (error) {
    console.error(error);
    const message = ErrorParser.tryParseWeaveError(error) || "An unknown error occurred";
    toast.show(message, ToastVariant.ERROR);
  } finally {
    billboard.close();
  }
}
