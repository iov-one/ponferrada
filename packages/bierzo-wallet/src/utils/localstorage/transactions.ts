import { ProcessedSendTransaction } from '../../store/notifications';

const LAST_TX_KEY = 'LAST_TX';

export function getLastTx(): ProcessedSendTransaction | undefined {
  const lastTxJson = localStorage.getItem(LAST_TX_KEY);
  if (lastTxJson) {
    const lastTx = JSON.parse(lastTxJson);
    // tslint:disable-next-line:no-object-mutation
    lastTx.time = new Date(lastTx.time);
    return lastTx;
  }

  return undefined;
}

export function storeLastTx(lastTx: ProcessedSendTransaction): void {
  localStorage.setItem(LAST_TX_KEY, JSON.stringify(lastTx));
}
