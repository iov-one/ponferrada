import { makeStyles } from '@material-ui/core';
import MarkunreadMailbox from '@material-ui/icons/MarkunreadMailboxOutlined';
import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

import { BwUnknownProps } from '../..';

interface Props {
  readonly tx: BwUnknownProps;
}

const useStyles = makeStyles({
  cell: {
    flex: '1 0 50px',
  },
});

function UnknownTxRow({ tx }: Props): JSX.Element {
  const classes = useStyles();

  return (
    <Block display="flex" flexDirection="column" paddingLeft={3} paddingRight={3}>
      <Block margin={2} />
      <Block display="flex" alignItems="center">
        <Block width="40px" textAlign="center">
          <MarkunreadMailbox fontSize="large" color="primary" />
        </Block>
        <Block className={classes.cell} paddingLeft={2} paddingRight={2}>
          <Typography variant="subtitle2" weight="semibold" gutterBottom>
            This is an unknown transaction
          </Typography>
          {tx.id && (
            <Typography variant="subtitle2" weight="regular" color="secondary">
              The transaction ID is: {`${tx.id}`}
            </Typography>
          )}
        </Block>
      </Block>
      <Block margin={2} />
      <Hairline />
    </Block>
  );
}

export default UnknownTxRow;
