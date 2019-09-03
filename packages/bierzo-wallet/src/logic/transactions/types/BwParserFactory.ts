import {
  Address,
  ConfirmedTransaction,
  FailedTransaction,
  isConfirmedTransaction,
  isFailedTransaction,
  isSendTransaction,
  LightTransaction,
} from "@iov/bcp";
import { isRegisterUsernameTx, RegisterUsernameTx } from "@iov/bns";

import { ProcessedSendTransaction } from "../../../store/notifications";
import { CsvRow } from "../../csvBuilder";
import { BwParser, ProcessedTx } from "../types/BwParser";
import { BwRegisterUsernameParser } from "./BwRegisterUsernameTx";
import { BwSendParser } from "./BwSendTransaction";
import { BwUnkownParser } from "./BwUnkownTransaction";

function isProcessedSendTransaction(tx: ProcessedTx): tx is ProcessedSendTransaction {
  return isSendTransaction(tx.original);
}

function isProcessedRegisterUsernameTx(tx: ProcessedTx): tx is ProcessedTx<RegisterUsernameTx> {
  return isRegisterUsernameTx(tx.original);
}

export class BwParserFactory {
  public static getReactComponent(tx: ProcessedTx, addresses: Address[]): JSX.Element {
    if (isProcessedSendTransaction(tx)) {
      return new BwSendParser().graphicalRepresentation(tx, addresses);
    } else if (isProcessedRegisterUsernameTx(tx)) {
      return new BwRegisterUsernameParser().graphicalRepresentation(tx);
    }

    return new BwUnkownParser().graphicalRepresentation(tx);
  }

  public static getHeaderRepresentation(tx: ProcessedTx, lastOne: boolean): JSX.Element {
    if (isProcessedSendTransaction(tx)) {
      return new BwSendParser().headerRepresentation(tx, lastOne);
    } else if (isProcessedRegisterUsernameTx(tx)) {
      return new BwRegisterUsernameParser().headerRepresentation(tx, lastOne);
    }

    return new BwUnkownParser().headerRepresentation(tx, lastOne);
  }

  public static getCsvRepresentation(tx: ProcessedTx): CsvRow {
    if (isProcessedSendTransaction(tx)) {
      return new BwSendParser().csvRepresentation(tx);
    } else if (isProcessedRegisterUsernameTx(tx)) {
      return new BwRegisterUsernameParser().csvRepresentation(tx);
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
