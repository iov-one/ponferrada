import { Grid, makeStyles } from '@material-ui/core';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

import { ProcessedTx } from '../../../../../store/notifications';
import { getAddressPrefix } from '../rowTxBuilder';

const useStyles = makeStyles({
  details: {
    paddingLeft: 60,
  },
  sectionName: {
    overflowWrap: 'break-word',
  },
});

interface Props {
  readonly tx: ProcessedTx;
}

const TxDetails = ({ tx }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <Block className={classes.details}>
      <Block margin={3} />
      <Grid>
        <Grid xs={12} sm={6}>
          <Block>
            <Typography variant="subtitle2" weight="regular" gutterBottom>
              {getAddressPrefix(tx)} address:
            </Typography>
            <Typography
              variant="subtitle2"
              weight="regular"
              color="textSecondary"
              className={classes.sectionName}
            >
              {tx.received ? tx.signer : tx.recipient}
            </Typography>
            <Block margin={3} />
          </Block>
        </Grid>
        <Grid xs={12} sm={6}>
          <Block>
            <Typography variant="subtitle2" weight="regular" gutterBottom>
              Note:
            </Typography>
            <Typography variant="subtitle2" weight="regular" color="textSecondary">
              {tx.memo ? tx.memo : 'No note'}
            </Typography>
          </Block>
        </Grid>
      </Grid>
    </Block>
  );
};

export default TxDetails;
