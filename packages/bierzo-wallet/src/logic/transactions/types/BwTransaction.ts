import {
  Address,
  BlockchainConnection,
  ConfirmedTransaction,
  FailedTransaction,
  LightTransaction,
} from '@iov/bcp';
import { ReadonlyDate } from 'readonly-date';

export type ParsedTx<T> = Pick<LightTransaction, 'kind'> & { time: ReadonlyDate } & T;

export abstract class BwTransaction<T extends LightTransaction, K> {
  abstract async parse(
    conn: BlockchainConnection,
    transaction: ConfirmedTransaction<T> | FailedTransaction,
    currentUserAddress: Address,
  ): Promise<ParsedTx<K>>;
  abstract graphicalRepresentation(tx: ParsedTx<K>): JSX.Element;
  abstract csvRepresentation(tx: ParsedTx<K>): string;
}
