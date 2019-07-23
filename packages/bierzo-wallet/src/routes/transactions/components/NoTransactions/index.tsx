import { makeStyles } from '@material-ui/core';
import Block from 'medulas-react-components/lib/components/Block';
import Image from 'medulas-react-components/lib/components/Image';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

import noTransactions from '../../assets/noTransactions.svg';

const useStyles = makeStyles({
  panel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 100,
  },
});

const NoTransactions = (): JSX.Element => {
  const classes = useStyles();

  return (
    <Block className={classes.panel}>
      <Image src={noTransactions} alt="No Transactions" />
      <Block margin={4} />
      <Block padding={2}>
        <Typography variant="subtitle1" weight="semibold" align="center">
          No transactions yet
        </Typography>
        <Block margin={0.5} />
        <Typography variant="subtitle1" color="textSecondary" align="center">
          Make your first transaction and it will appear here
        </Typography>
      </Block>
    </Block>
  );
};

export default NoTransactions;
