import { makeStyles } from '@material-ui/core';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

import { ProcessedTx } from '../../../../../store/notifications';
import { getAddressPrefix } from '../rowTxBuilder';

const useStyles = makeStyles({
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
    <Block paddingLeft="56px" display="flex" flexDirection="column">
      <Block margin={2} />
      <Block display="flex">
        <Block width="50%">
          <Typography variant="subtitle2" weight="regular" gutterBottom>
            {getAddressPrefix(tx)} address:
          </Typography>
          <Typography
            variant="subtitle2"
            weight="regular"
            color="textSecondary"
            className={classes.sectionName}
          >
            {tx.received ? tx.sender : tx.recipient}
          </Typography>
        </Block>
        <Block width="50%">
          <Block>
            <Typography variant="subtitle2" weight="regular" gutterBottom>
              Note:
            </Typography>
            <Typography variant="subtitle2" weight="regular" color="textSecondary">
              {tx.memo ? tx.memo : 'No note'}
            </Typography>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default TxDetails;
