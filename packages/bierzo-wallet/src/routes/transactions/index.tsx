import FileSaver from 'file-saver';
import * as React from 'react';
import { useSelector } from 'react-redux';

import PageMenu from '../../components/PageMenu';
import { ProcessedTx } from '../../store/notifications';
import Layout from './components';
import { filterTxsBy } from './components/sorting';

interface State {
  readonly rowsPerPage: number;
  readonly pageNumber: number;
  readonly orderBy: TxsOrder;
  readonly order: SortOrder;
}

const Transactions = (): JSX.Element => {
  const [rows, setRows] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState(TX_DATE_COLUMN as TxsOrder);
  const [order, setOrder] = React.useState(ORDER_DESC as SortOrder);
  const txs = useSelector((state: RootState) => state.notifications.transactions);

  function onChangeRows(item: Item): void {
    setRows(Number(item.name));
  }

  function onSort(receivedOrderBy: TxsOrder, receivedOrder: SortOrder): () => void {
    return () => {
      const isActualSort = orderBy === receivedOrderBy && order === receivedOrder;
      if (isActualSort) {
        return;
      }

      setOrderBy(receivedOrderBy);
      setOrder(receivedOrder);
    };
  }

  function onPrevPage(): void {
    setPage(page => Math.max(page - 1, 0));
  }

  function onNextPage(): void {
    const totalPages = Math.ceil(txs.length / rows);
    if (page === totalPages - 1) {
      return;
    }

    setPage(page => page + 1);
  }

  function onDownloadCSV(): void {
    const csvHeader =
      '"ID";"Recipient";"Signer";"Quantity";"Fractional Digits";"Token Ticker";"Time";"Received";"Success";"Error";"Note"';
    const csvBody = txs.map((tx: ProcessedTx) => {
      const parties = `"${tx.id}";"${tx.recipient}";"${tx.signer}";`;
      const payment = `"${tx.amount.quantity}";"${tx.amount.fractionalDigits}";"${tx.amount.tokenTicker}";`;
      const date = `"${tx.time.toISOString()}";`;
      const status = `"${tx.received}";"${tx.success}";"${tx.err}";"${tx.memo}"`;

      const txRow = `${parties}${payment}${date}${status}`;

      return txRow;
    });

    const blob = new Blob([`${csvHeader}\n${csvBody.join('\n')}`], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, 'transactions.csv');
  }

  const orderedTxs = filterTxsBy(txs, rows, page, orderBy, order);

  return (
    <PageMenu>
      <Layout
        txs={orderedTxs}
        onChangeRows={onChangeRows}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        onSort={onSort}
        onDownloadCSV={onDownloadCSV}
        orderBy={orderBy}
        order={order}
        connection={connection}
      />
    </PageMenu>
  );
};

export default Transactions;
