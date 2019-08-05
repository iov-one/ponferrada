import { ProcessedSendTransaction } from '../../store/notifications';

export const LAST_TX = 'LAST_TX';

export function getLastTx(): ProcessedSendTransaction | undefined {
  const lastTxJson = localStorage.getItem(LAST_TX);
  if (lastTxJson) {
    const lastTx = JSON.parse(lastTxJson);
    // tslint:disable-next-line:no-object-mutation
    lastTx.time = new Date(lastTx.time);
    return lastTx;
  }

  return undefined;
}

export function storeLastTx(lastTx: ProcessedSendTransaction): void {
  localStorage.setItem(LAST_TX, JSON.stringify(lastTx));
}
