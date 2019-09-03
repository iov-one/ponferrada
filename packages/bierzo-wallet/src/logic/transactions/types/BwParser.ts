import {
  Address,
  BlockchainConnection,
  ConfirmedTransaction,
  FailedTransaction,
  LightTransaction,
  TransactionId,
} from "@iov/bcp";
import { ReadonlyDate } from "readonly-date";

import { CsvRow } from "../../csvBuilder";

export interface ProcessedTx<T = LightTransaction> {
  readonly time: ReadonlyDate;
  readonly id: TransactionId;
  readonly original: T;
}

export abstract class BwParser<K> {
  abstract async parse(
    conn: BlockchainConnection,
    transaction: ConfirmedTransaction<LightTransaction> | FailedTransaction,
    currentUserAddress: Address,
  ): Promise<ProcessedTx>;
  abstract graphicalRepresentation(tx: ProcessedTx, addresses: Address[]): JSX.Element;
  abstract csvRepresentation(tx: ProcessedTx): CsvRow;
  abstract headerRepresentation(tx: ProcessedTx, lastOne: boolean): JSX.Element;
}
