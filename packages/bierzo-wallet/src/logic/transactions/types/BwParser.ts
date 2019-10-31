import {
  Address,
  BlockchainConnection,
  ConfirmedTransaction,
  FailedTransaction,
  LightTransaction,
  TransactionId,
} from "@iov/bcp";
import { ReadonlyDate } from "readonly-date";

export interface ProcessedTx<T = LightTransaction> {
  readonly time: ReadonlyDate;
  readonly id: TransactionId;
  readonly original: T;
}

export abstract class BwParser<K extends LightTransaction> {
  abstract async parse(
    conn: BlockchainConnection,
    transaction: ConfirmedTransaction<K> | FailedTransaction,
    currentUserAddress: Address,
  ): Promise<ProcessedTx>;
  abstract graphicalRepresentation(tx: ProcessedTx<K>, addresses: Address[]): JSX.Element;
  abstract headerRepresentation(tx: ProcessedTx<K>, lastOne: boolean): JSX.Element;
}
