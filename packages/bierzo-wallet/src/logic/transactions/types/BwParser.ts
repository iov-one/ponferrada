import {
  Address,
  BlockchainConnection,
  ConfirmedTransaction,
  FailedTransaction,
  LightTransaction,
} from '@iov/bcp';
import { ReadonlyDate } from 'readonly-date';

export type ParsedTx = Pick<LightTransaction, 'kind'> & { time: ReadonlyDate };

export abstract class BwParser<K> {
  abstract async parse(
    conn: BlockchainConnection,
    transaction: ConfirmedTransaction<LightTransaction> | FailedTransaction,
    currentUserAddress: Address,
  ): Promise<ParsedTx>;
  abstract graphicalRepresentation(tx: ParsedTx): JSX.Element;
  abstract csvRepresentation(tx: ParsedTx): string;
  abstract headerRepresentation(tx: ParsedTx, lastOne: boolean): JSX.Element;
}
