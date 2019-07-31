import { ParsedTx } from '../../../logic/transactions/types/BwTransaction';

export interface SortingStateProps {
  readonly onSort: (orderBy: TxsOrder, order: SortOrder) => () => void;
  readonly orderBy: TxsOrder;
  readonly order: SortOrder;
}

export const ORDER_ASC = 1;
export const ORDER_DESC = -1;
export type SortOrder = 1 | -1;

export const TX_AMOUNT_COLUMN = 'Amount';
export const TX_DATE_COLUMN = 'Date';
export type TxsOrder = 'Date';

export const filterTxsBy = <K>(
  txs: ReadonlyArray<ParsedTx<K>>,
  rowsPerPage: number,
  pageNumber: number,
  orderBy: TxsOrder,
  order: SortOrder,
): ReadonlyArray<ParsedTx<K>> => {
  const orderedTxs = txs.slice(0); // make a mutable copy

  if (orderBy === TX_DATE_COLUMN) {
    orderedTxs.sort((a: ParsedTx<K>, b: ParsedTx<K>) => {
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
