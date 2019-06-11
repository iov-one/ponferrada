import { ProcessedTx } from '~/store/notifications/state';

export const LAST_TX = 'LAST_TX';

export function getLastTx(): ProcessedTx | undefined {
  const lastTxJson = localStorage.getItem(LAST_TX);
  if (lastTxJson) {
    const lastTx = JSON.parse(lastTxJson);
    // tslint:disable-next-line:no-object-mutation
    lastTx.time = new Date(lastTx.time);
    return lastTx;
  }

  return undefined;
}

export function storeLastTx(lastTx: ProcessedTx): void {
  localStorage.setItem(LAST_TX, JSON.stringify(lastTx));
}
