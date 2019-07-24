import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import Block from 'medulas-react-components/lib/components/Block';
import Img from 'medulas-react-components/lib/components/Image';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

import sortDown from '../../../../assets/sortDown.svg';
import sortDownActive from '../../../../assets/sortDownActive.svg';
import sortUp from '../../../../assets/sortUp.svg';
import sortUpActive from '../../../../assets/sortUpActive.svg';
import { calculateOppositeOrder, ORDER_ASC, ORDER_DESC, SortingStateProps } from '../../../sorting';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    flex: '1 0 10px',
    cursor: 'pointer',
  },
  alignRight: {
    justifyContent: 'flex-end',
  },
  sorting: {
    display: 'flex',
    flexDirection: 'column',
  },
});

interface Props extends SortingStateProps {
  readonly name: 'Date';
  readonly alignRight?: boolean;
}

const TxSortableColumn = ({ name, order, orderBy, alignRight, onSort }: Props): JSX.Element => {
  const classes = useStyles();
  const headerClasses = classNames(classes.header, { [classes.alignRight]: alignRight });
  const sortOrder = orderBy === name ? order : undefined;

  return (
    <Block className={headerClasses} onClick={onSort(name, calculateOppositeOrder(order))}>
      <Block className={classes.sorting} padding={1}>
        <Img src={sortOrder === ORDER_ASC ? sortUpActive : sortUp} alt="Descending sort" />
        <Block margin={0.5} />
        <Img src={sortOrder === ORDER_DESC ? sortDownActive : sortDown} alt="Ascending sort" />
      </Block>
      <Typography variant="subtitle2" weight="semibold">
        {name}
      </Typography>
    </Block>
  );
};

export default TxSortableColumn;
