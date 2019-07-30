import { BlockchainConnection, ConfirmedTransaction, Identity, LightTransaction, TxCodec } from '@iov/bcp';
import { ReadonlyDate } from 'readonly-date';

export type ParsedTx<T> = Pick<LightTransaction, 'kind'> & { time: ReadonlyDate } & T;

export abstract class BwTransaction<T extends LightTransaction, K> {
  abstract async parse(
    conn: BlockchainConnection,
    transaction: ConfirmedTransaction<T>,
    identity: Identity,
    codec: TxCodec,
  ): Promise<ParsedTx<K>>;
  abstract graphicalRepresentation(tx: ParsedTx<K>): JSX.Element;
}

/*
export class BwTransactionFactory {
  public static getTxFrom(
    trans: ConfirmedTransaction<LightTransaction> | FailedTransaction,
  ): BwTransaction<TxCodec, K> {
    if (isFailedTransaction(trans)) {
      throw new Error('Not supported error txs for now');
    }

    if (!isConfirmedTransaction(trans)) {
      throw new Error('Confirmed transaction expected');
    }

    const { transaction: payload } = trans;
    if (isSendTransaction(payload)) {
      const tx = new BwSendTransaction().parse(
        conn,
        trans as ConfirmedTransaction<SendTransaction>,
        identity,
        codec,
      );

      return tx;
    }
  }
}
*/
