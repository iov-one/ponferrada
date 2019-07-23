import { BnsConnection } from '@iov/bns';
import Form, { useForm } from 'medulas-react-components/lib/components/forms/Form';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import * as React from 'react';

import DownloadCSV, { DownloadCSVProps } from './DownloadCSV';
import TxTable from './TxTable';
import { TxTableProps } from './TxTable/rowTxBuilder';

interface Props extends DownloadCSVProps, TxTableProps {
  readonly connection: BnsConnection;
}

const onSubmit = (): void => {};

const Layout = ({
  onDownloadCSV,
  txs,
  onChangeRows,
  onPrevPage,
  onNextPage,
  onSort,
  orderBy,
  order,
  connection,
}: Props): JSX.Element => {
  const { handleSubmit } = useForm({
    onSubmit,
  });

  return (
    <React.Fragment>
      <Hairline />
      <DownloadCSV onDownloadCSV={onDownloadCSV} />
      <Hairline />
      <Form onSubmit={handleSubmit}>
        <TxTable
          txs={txs}
          onChangeRows={onChangeRows}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
          onSort={onSort}
          orderBy={orderBy}
          order={order}
          connection={connection}
        />
      </Form>
    </React.Fragment>
  );
};

export default Layout;
