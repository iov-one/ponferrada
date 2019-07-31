import { makeStyles, Theme } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import * as React from 'react';

import { getShadowColor } from '../../../../theme/css';
import { CSV_PADDING } from '../DownloadCSV';
import { TxTableProps } from './rowTxBuilder';
import TxTableFooter from './TxTableFooter';
import TxTableHeader from './TxTableHeader';

const useStyles = makeStyles((theme: Theme) => ({
  inner: {
    flexBasis: 'auto',
  },
  panel: {
    boxShadow: `0 0 20px 0 ${getShadowColor()}`,
  },
}));

function TxTable({
  onSort,
  orderBy,
  order,
  rows,
  onChangeRows,
  onNextPage,
  onPrevPage,
}: TxTableProps): JSX.Element {
  const classes = useStyles();
  const theme = useTheme<Theme>();

  return (
    <Block display="flex">
      <Block width={theme.spacing(CSV_PADDING)} flexShrink={1} />
      <Block display="flex" flexGrow={1} flexShrink={0} flexDirection="column" className={classes.inner}>
        <Block margin={3} />
        <Block
          display="flex"
          flexDirection="column"
          borderRadius="4px"
          bgcolor="white"
          className={classes.panel}
        >
          <TxTableHeader onSort={onSort} orderBy={orderBy} order={order} />
          <Block display="flex" flexDirection="column">
            {rows}
            <TxTableFooter onChangeRows={onChangeRows} onNextPage={onNextPage} onPrevPage={onPrevPage} />
          </Block>
        </Block>
        <Block margin={3} />
      </Block>
      <Block width={theme.spacing(CSV_PADDING)} flexShrink={1} />
    </Block>
  );
}

export default TxTable;
