import {
  ConfirmedTransaction,
  FailedTransaction,
  isConfirmedTransaction,
  isFailedTransaction,
  isSendTransaction,
  LightTransaction,
} from "@iov/bcp";
import { isRegisterUsernameTx, RegisterUsernameTx } from "@iov/bns";

import { ProcessedSendTransaction } from "../../../store/notifications";
import { BwParser, ProcessedTx } from "../types/BwParser";
import { BwRegisterUsernameParser } from "./BwRegisterUsernameTx";
import { BwSendParser } from "./BwSendTransaction";
import { BwUnkownParser } from "./BwUnkownTransaction";

function isProcessedSendTransaction(tx: ProcessedTx): tx is ProcessedSendTransaction {
  return isSendTransaction(tx.original);
}

export class BwParserFactory {
  public static getReactComponent(tx: ProcessedTx): JSX.Element {
    if (isProcessedSendTransaction(tx)) {
      return new BwSendParser().graphicalRepresentation(tx);
    } else if (isRegisterUsernameTx(tx.original)) {
      return new BwRegisterUsernameParser().graphicalRepresentation(tx as ProcessedTx<RegisterUsernameTx>);
    }

    return new BwUnkownParser().graphicalRepresentation(tx);
  }

  public static getHeaderRepresentation(tx: ProcessedTx, lastOne: boolean): JSX.Element {
    if (isProcessedSendTransaction(tx)) {
      return new BwSendParser().headerRepresentation(tx, lastOne);
    } else if (isRegisterUsernameTx(tx.original)) {
      return new BwRegisterUsernameParser().headerRepresentation(
        tx as ProcessedTx<RegisterUsernameTx>,
        lastOne,
      );
    }

    return new BwUnkownParser().headerRepresentation(tx, lastOne);
  }

  public static getCsvRepresentation(tx: ProcessedTx): string {
    if (isProcessedSendTransaction(tx)) {
      return new BwSendParser().csvRepresentation(tx);
    } else if (isRegisterUsernameTx(tx.original)) {
      return new BwRegisterUsernameParser().csvRepresentation(tx as ProcessedTx<RegisterUsernameTx>);
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
    } else if (isRegisterUsernameTx(payload)) {
      return new BwRegisterUsernameParser();
    }

    return new BwUnkownParser();
  }
}
