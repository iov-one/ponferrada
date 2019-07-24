import { makeStyles } from '@material-ui/core';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import * as React from 'react';

import { SortingStateProps, TX_AMOUNT_COLUMN, TX_DATE_COLUMN } from '../../sorting';
import TxColumn from './utils/TxColumn';
import TxSortableColumn from './utils/TxSortableColumn';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    flex: '1 0 40px',
  },
});

const TxTableHeader = ({ orderBy, order, onSort }: SortingStateProps): JSX.Element => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Block margin={1} />
      <Block paddingLeft={3} paddingRight={3} className={classes.header}>
        <TxColumn name="Transactions" />
        <Block flexGrow={1} />
        <TxSortableColumn name={TX_DATE_COLUMN} orderBy={orderBy} order={order} onSort={onSort} />
        <Block flexGrow={1} />
        <TxColumn name={TX_AMOUNT_COLUMN} alignRight />
      </Block>
      <Block margin={1} />
      <Hairline />
    </React.Fragment>
  );
};

export default TxTableHeader;
