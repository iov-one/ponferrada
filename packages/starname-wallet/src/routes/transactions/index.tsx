import { SelectFieldItem } from "medulas-react-components";
import * as React from "react";
import { useSelector } from "react-redux";

import PageMenu from "../../components/PageMenu";
import { BwParserFactory } from "../../logic/transactions/types/BwParserFactory";
import { lastTxSelector } from "../../store/notifications/selectors";
import { RootState } from "../../store/reducers";
import { storeLastTx, TxMeta } from "../../utils/localstorage/transactions";
import Layout from "./components";
import { filterTxsBy, ORDER_DESC, SortOrder, TX_DATE_COLUMN, TxsOrder } from "./components/sorting";

const Transactions = (): JSX.Element => {
  const [rows, setRows] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState(TX_DATE_COLUMN);
  const [order, setOrder] = React.useState(ORDER_DESC);
  const parsedTxs = useSelector((state: RootState) => state.notifications.transactions);
  const identities = useSelector((state: RootState) => state.identities);
  const lastTx = useSelector(lastTxSelector);

  if (lastTx) {
    storeLastTx(lastTx as TxMeta);
  }

  const userAddresses = Array.from(identities.values()).map(extendedIdentity => extendedIdentity.address);

  const orderedTxs = filterTxsBy(parsedTxs, rows, page, orderBy, order);
  const txs = React.useMemo(
    () => orderedTxs.map(tx => BwParserFactory.getReactComponent(tx, userAddresses)),
    [orderedTxs, userAddresses],
  );

  function onChangeRows(item: SelectFieldItem | undefined): void {
    if (item) {
      setRows(Number(item.name));
    }
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
    const totalPages = Math.ceil(parsedTxs.length / rows);
    if (page === totalPages - 1) {
      return;
    }

    setPage(page => page + 1);
  }

  return (
    <PageMenu padding={false}>
      <Layout
        rows={txs}
        onChangeRows={onChangeRows}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        onSort={onSort}
        orderBy={orderBy}
        order={order}
      />
    </PageMenu>
  );
};

export default Transactions;
