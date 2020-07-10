import { makeStyles } from "@material-ui/core";
import MarkunreadMailbox from "@material-ui/icons/MarkunreadMailboxOutlined";
import { Block, Hairline, Typography } from "medulas-react-components";
import * as React from "react";

import { ProcessedTx } from "../../../BwParser";

interface Props {
  readonly tx: ProcessedTx;
}

const useStyles = makeStyles({
  cell: {
    flex: "1 0 50px",
  },
});

function UnknownTxRow({ tx }: Props): React.ReactElement {
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
