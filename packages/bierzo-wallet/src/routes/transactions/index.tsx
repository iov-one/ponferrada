import { Address, Identity } from "@iov/bcp";
import FileSaver from "file-saver";
import { SelectFieldFormItem } from "medulas-react-components";
import * as React from "react";
import { useSelector } from "react-redux";

import PageMenu from "../../components/PageMenu";
import { ProcessedTx } from "../../logic/transactions/types/BwParser";
import { BwParserFactory } from "../../logic/transactions/types/BwParserFactory";
import { RootState } from "../../store/reducers";
import { getChainAddressPairs } from "../../utils/tokens";
import Layout from "./components";
import { filterTxsBy, ORDER_DESC, SortOrder, TX_DATE_COLUMN, TxsOrder } from "./components/sorting";

const Transactions = (): JSX.Element => {
  const [userAddresses, setUserAddresses] = React.useState<Address[]>([]);
  const [rows, setRows] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState(TX_DATE_COLUMN);
  const [order, setOrder] = React.useState(ORDER_DESC);
  const parsedTxs = useSelector((state: RootState) => state.notifications.transactions);
  const identities = useSelector((state: RootState) => state.extension.identities);

  React.useEffect(() => {
    let isSubscribed = false;
    async function processIdentities(identities: { [chain: string]: Identity }): Promise<void> {
      const addressPairs = (await getChainAddressPairs(identities)).map(pair => pair.address);
      if (isSubscribed) {
        setUserAddresses(addressPairs);
      }
    }

    processIdentities(identities);

    return () => {
      isSubscribed = false;
    };
  }, [identities]);

  const orderedTxs = filterTxsBy(parsedTxs, rows, page, orderBy, order);
  const txs = React.useMemo(
    () => orderedTxs.map(tx => BwParserFactory.getReactComponent(tx, userAddresses)),
    [orderedTxs, userAddresses],
  );

  function onChangeRows(item: SelectFieldFormItem): void {
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
    // TODO UPDATE HEADER WHEN OTHER TX TYPES ARE ADDED
    const csvHeader =
      '"ID";"Recipient";"Sender";"Quantity";"Fractional Digits";"Token Ticker";"Fee Quantity";"Fee Fractional Digits";"Fee Token Ticker";"Time";"Note"';
    const csvBody = orderedTxs.map((tx: ProcessedTx) => BwParserFactory.getCsvRepresentation(tx));

    const blob = new Blob([`${csvHeader}\n${csvBody.join("\n")}`], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, "transactions.csv");
  }

  return (
    <PageMenu padding={false}>
      <Layout
        rows={txs}
        onChangeRows={onChangeRows}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        onSort={onSort}
        onDownloadCSV={onDownloadCSV}
        orderBy={orderBy}
        order={order}
      />
    </PageMenu>
  );
};

export default Transactions;
