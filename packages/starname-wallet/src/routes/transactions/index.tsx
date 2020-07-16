import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { RpcEndpoint } from "communication/rpcEndpoint";
import { useRpcEndpoint } from "contexts/rpcEndpointContext";
import { Transaction, TransactionDirection } from "logic/api";
import receiveTx from "logic/transactions/assets/transactionReceive.svg";
import sendTx from "logic/transactions/assets/transactionSend.svg";
import { Block, Hairline, Image } from "medulas-react-components";
import * as React from "react";
import NoTransactions from "routes/transactions/components/NoTransactions";
import SendTokens from "routes/transactions/components/SendTokens";

import PageMenu from "../../components/PageMenu";

const Transactions = (): React.ReactElement => {
  const rpcEndpoint: RpcEndpoint = useRpcEndpoint();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  // const [rows, setRows] = React.useState(5);
  // const [page, setPage] = React.useState(0);
  // const [orderBy, setOrderBy] = React.useState(TX_DATE_COLUMN);
  // const [order, setOrder] = React.useState(ORDER_DESC);
  // const parsedTxs = useSelector((state: RootState) => state.notifications.transactions);
  // const identities = useSelector((state: RootState) => state.identities);
  // const lastTx = useSelector(lastTxSelector);

  React.useEffect(() => {
    rpcEndpoint.getTransactions().then(setTransactions);
  }, [rpcEndpoint]);

  /*
  if (lastTx) {
    storeLastTx(lastTx as TxMeta);
  }

  const userAddresses = Array.from(identities.values()).map((extendedIdentity) => extendedIdentity.address);

  const orderedTxs = transactions.map((tx: Transaction): ProcessedTx => ({

  })); // filterTxsBy(parsedTxs, rows, page, orderBy, order);
  const txs = React.useMemo(
    () => orderedTxs.map((tx: ProcessedTx) => BwParserFactory.getReactComponent(tx, userAddresses)),
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
    setPage((page) => Math.max(page - 1, 0));
  }

  function onNextPage(): void {
    const totalPages = Math.ceil(parsedTxs.length / rows);
    if (page === totalPages - 1) {
      return;
    }

    setPage((page) => page + 1);
  }*/
  /*
      <Layout
        rows={txs}
        onChangeRows={onChangeRows}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        onSort={onSort}
        orderBy={orderBy}
        order={order}
      />
 */
  return (
    <PageMenu padding={false}>
      <Hairline />
      <SendTokens />
      <Hairline />
      {transactions.length > 0 ? (
        transactions.map(
          (transaction: Transaction): React.ReactElement => {
            const {
              value: { memo, msg },
            } = transaction.tx;
            const {
              value: { from_address: fromAddress, to_address: toAddress, amount },
            } = msg[0];
            const icon = transaction.direction === TransactionDirection.Outgoing ? sendTx : receiveTx;
            return (
              <Block key={transaction.txhash} display="flex">
                <Block
                  display="flex"
                  flexBasis="80%"
                  flexShrink={0}
                  flexDirection="column"
                  marginTop={6}
                  marginBottom={6}
                  marginLeft="auto"
                  marginRight="auto"
                >
                  <Block display="flex" flexDirection="column" borderRadius="4px" bgcolor="white">
                    <Block display="flex" flexDirection="column">
                      <ListItem>
                        <Image src={icon} height={30} alt="Tx operation" />
                        <Block paddingLeft={2}>
                          <ListItemText
                            className={}
                            primary={`${fromAddress} sent ${amount[0].value / 1e6} IOV to ${toAddress}`}
                            secondary={memo}
                          />
                        </Block>
                      </ListItem>
                    </Block>
                  </Block>
                </Block>
              </Block>
            );
          },
        )
      ) : (
        <NoTransactions />
      )}
    </PageMenu>
  );
};

export default Transactions;
