import { ProcessedTx } from "logic/transactions/types/BwParser";

export interface SortingStateProps {
  readonly onSort: (orderBy: TxsOrder, order: SortOrder) => () => void;
  readonly orderBy: TxsOrder;
  readonly order: SortOrder;
}

export type SortOrder = 1 | -1;
export const ORDER_ASC: SortOrder = 1;
export const ORDER_DESC: SortOrder = -1;

export const TX_AMOUNT_COLUMN = "Amount" as const;
export const TX_DATE_COLUMN = "Date" as const;
export type TxsOrder = "Date";

export const filterTxsBy = (
  txs: readonly ProcessedTx[],
  rowsPerPage: number,
  pageNumber: number,
  orderBy: TxsOrder,
  order: SortOrder,
): readonly ProcessedTx[] => {
  const orderedTxs = txs.slice(0); // make a mutable copy

  if (orderBy === TX_DATE_COLUMN) {
    orderedTxs.sort((a: ProcessedTx, b: ProcessedTx) => {
      return (a.time < b.time ? -1 : a.time > b.time ? 1 : 0) * order;
    });
  }

  const pageStartIdx = pageNumber * rowsPerPage;
  const pageEndIdx = Math.min(txs.length, pageStartIdx + rowsPerPage);
  const txsToRender = orderedTxs.slice(pageStartIdx, pageEndIdx);

  return txsToRender;
};

export const calculateOppositeOrder = (order: SortOrder): SortOrder => {
  return (order * -1) as SortOrder;
};
