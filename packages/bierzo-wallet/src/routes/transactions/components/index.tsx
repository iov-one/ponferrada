import Hairline from 'medulas-react-components/lib/components/Hairline';
import * as React from 'react';

import DownloadCSV, { DownloadCSVProps } from './DownloadCSV';
import TxTable from './TxTable';
import { TxTableProps } from './TxTable/rowTxBuilder';

interface Props extends DownloadCSVProps, TxTableProps {}

const Layout = ({
  onDownloadCSV,
  txs,
  onChangeRows,
  onPrevPage,
  onNextPage,
  onSort,
  orderBy,
  order,
}: Props): JSX.Element => (
  <React.Fragment>
    <Hairline />
    <DownloadCSV onDownloadCSV={onDownloadCSV} />
    <Hairline />
    <TxTable
      txs={txs}
      onChangeRows={onChangeRows}
      onPrevPage={onPrevPage}
      onNextPage={onNextPage}
      onSort={onSort}
      orderBy={orderBy}
      order={order}
    />
  </React.Fragment>
);

export default Layout;
