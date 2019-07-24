import { makeStyles, Theme } from '@material-ui/core';
import Block from 'medulas-react-components/lib/components/Block';
import * as React from 'react';

import { ProcessedTx } from '../../../../store/notifications';
import { getShadowColor } from '../../../../theme/css';
import { TxTableProps } from './rowTxBuilder';
import TxTableFooter from './TxTableFooter';
import TxTableHeader from './TxTableHeader';
import TxTableRow from './TxTableRow';

const useStyles = makeStyles((theme: Theme) => ({
  inner: {
    display: 'flex',
    flex: '1 0 auto',
    flexDirection: 'column',
  },
  outer: {
    display: 'flex',
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    borderRadius: 4,
    boxShadow: `0 0 20px 0 ${getShadowColor()}`,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

function TxTable({
  onSort,
  orderBy,
  order,
  txs,
  onChangeRows,
  onNextPage,
  onPrevPage,
}: TxTableProps): JSX.Element {
  const classes = useStyles();

  return (
    <Block className={classes.outer}>
      <Block width={200} flexGrow={1} />
      <Block className={classes.inner}>
        <Block margin={3} />
        <Block className={classes.panel}>
          <TxTableHeader onSort={onSort} orderBy={orderBy} order={order} />
          <Block className={classes.column}>
            {txs.map((tx: ProcessedTx) => (
              <TxTableRow key={tx.id} tx={tx} />
            ))}
            <TxTableFooter onChangeRows={onChangeRows} onNextPage={onNextPage} onPrevPage={onPrevPage} />
          </Block>
        </Block>
        <Block margin={3} />
      </Block>
      <Block width={200} flexGrow={1} />
    </Block>
  );
}

export default TxTable;
