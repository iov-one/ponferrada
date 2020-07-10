import {
  Address,
  BlockchainConnection,
  ConfirmedTransaction,
  FailedTransaction,
  isFailedTransaction,
  TransactionId,
  UnsignedTransaction,
} from "@iov/bcp";
import { ReadonlyDate } from "readonly-date";

export interface ProcessedTx<T extends UnsignedTransaction = UnsignedTransaction> {
  readonly time: ReadonlyDate;
  readonly id: TransactionId;
  readonly original: T;
}

export abstract class BwParser<K extends UnsignedTransaction> {
  public async parse(
    conn: BlockchainConnection,
    transaction: ConfirmedTransaction<K> | FailedTransaction,
    _: Address,
  ): Promise<ProcessedTx<K>> {
    if (isFailedTransaction(transaction)) {
      throw new Error("Not supported error txs for now");
    }

    const header = await conn.getBlockHeader(transaction.height);
    const time = header.time;

    return {
      id: transaction.transactionId,
      time,
      original: transaction.transaction,
    };
  }
  abstract graphicalRepresentation(tx: ProcessedTx<K>, addresses: Address[]): React.ReactElement;
  abstract headerRepresentation(tx: ProcessedTx<K>, lastOne: boolean): React.ReactElement;
}
