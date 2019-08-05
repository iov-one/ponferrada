import {
  ConfirmedTransaction,
  FailedTransaction,
  isConfirmedTransaction,
  isFailedTransaction,
  isSendTransaction,
  LightTransaction,
} from "@iov/bcp";

import { ProcessedSendTransaction } from "../../../store/notifications";
import { BwParser, ProcessedTx } from "../types/BwParser";
import { BwSendParser } from "./BwSendTransaction";
import { BwUnkownParser } from "./BwUnkownTransaction";

function isProcessedSendTransaction(tx: ProcessedTx): tx is ProcessedSendTransaction {
  return isSendTransaction(tx.original);
}

export class BwParserFactory {
  public static getReactComponent(tx: ProcessedTx): JSX.Element {
    if (isProcessedSendTransaction(tx)) {
      return new BwSendParser().graphicalRepresentation(tx);
    }

    return new BwUnkownParser().graphicalRepresentation(tx);
  }

  public static getHeaderRepresentation(tx: ProcessedTx, lastOne: boolean): JSX.Element {
    if (isProcessedSendTransaction(tx)) {
      return new BwSendParser().headerRepresentation(tx, lastOne);
    }

    return new BwUnkownParser().headerRepresentation(tx, lastOne);
  }

  public static getCsvRepresentation(tx: ProcessedTx): string {
    if (isProcessedSendTransaction(tx)) {
      return new BwSendParser().csvRepresentation(tx);
    }

    return new BwUnkownParser().csvRepresentation(tx);
  }

  public static getBwTransactionFrom(
    trans: ConfirmedTransaction<LightTransaction> | FailedTransaction,
  ): BwParser<ProcessedTx> {
    if (isFailedTransaction(trans)) {
      throw new Error("Not supported error txs for now");
    }

    if (!isConfirmedTransaction(trans)) {
      throw new Error("Confirmed transaction expected");
    }

    const { transaction: payload } = trans;
    if (isSendTransaction(payload)) {
      return new BwSendParser();
    }

    return new BwUnkownParser();
  }
}
