import Hairline from "medulas-react-components/lib/components/Hairline";
import * as React from "react";

import DownloadCSV, { DownloadCSVProps } from "./DownloadCSV";
import NoTransactions from "./NoTransactions";
import TxTable from "./TxTable";
import { TxTableProps } from "./TxTable/rowTxBuilder";

interface Props extends DownloadCSVProps, TxTableProps {}

const Layout = ({
  onDownloadCSV,
  rows,
  onChangeRows,
  onPrevPage,
  onNextPage,
  onSort,
  orderBy,
  order,
}: Props): JSX.Element => {
  const hasRows = rows && rows.length > 0;

  return (
    <React.Fragment>
      <Hairline />
      <DownloadCSV onDownloadCSV={onDownloadCSV} />
      <Hairline />
      {hasRows ? (
        <TxTable
          rows={rows}
          onChangeRows={onChangeRows}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
          onSort={onSort}
          orderBy={orderBy}
          order={order}
        />
      ) : (
        <NoTransactions />
      )}
    </React.Fragment>
  );
};

export default Layout;
