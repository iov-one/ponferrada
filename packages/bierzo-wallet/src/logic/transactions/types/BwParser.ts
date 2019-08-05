import {
  Address,
  BlockchainConnection,
  ConfirmedTransaction,
  FailedTransaction,
  LightTransaction,
  TransactionId,
} from '@iov/bcp';
import { ReadonlyDate } from 'readonly-date';

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
  abstract graphicalRepresentation(tx: ProcessedTx): JSX.Element;
  abstract csvRepresentation(tx: ProcessedTx): string;
  abstract headerRepresentation(tx: ProcessedTx, lastOne: boolean): JSX.Element;
}
