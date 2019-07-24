import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

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
});

interface Props {
  readonly name: 'Amount';
  readonly alignRight?: boolean;
}

const TxColumn = ({ name, alignRight }: Props): JSX.Element => {
  const classes = useStyles();
  const headerClasses = classNames(classes.header, { [classes.alignRight]: alignRight });

  return (
    <Block className={headerClasses}>
      <Typography variant="subtitle2" weight="semibold">
        {name}
      </Typography>
    </Block>
  );
};

export default TxColumn;
