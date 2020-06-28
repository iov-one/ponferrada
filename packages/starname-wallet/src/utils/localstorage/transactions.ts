import { ReadonlyDate } from "readonly-date";

export interface TxMeta {
  readonly time: ReadonlyDate;
  readonly id: string;
}

const LAST_TX_KEY = "LAST_TX";

export function getLastTx(): TxMeta | undefined {
  const storageItem = localStorage.getItem(LAST_TX_KEY);
  if (storageItem) {
    const parsed = JSON.parse(storageItem);
    return {
      time: new Date(parsed.time),
      id: parsed.id,
    };
  }

  return undefined;
}

export function storeLastTx(lastTx: TxMeta): void {
  // Create copy to only store what we need
  const storageItem: TxMeta = {
    time: lastTx.time,
    id: lastTx.id,
  };

  localStorage.setItem(LAST_TX_KEY, JSON.stringify(storageItem));
}
