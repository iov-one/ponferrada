import { ListItemText, makeStyles, Theme } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import MarkunreadMailbox from "@material-ui/icons/MarkunreadMailboxOutlined";
import { Block, Hairline, Typography } from "medulas-react-components";
import * as React from "react";

import { itemBackground } from "../../../../../../theme/css";
import { ProcessedTx } from "../../../BwParser";

interface Props {
  readonly tx: ProcessedTx;
  readonly lastOne: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  msg: {
    "& > span": {
      lineHeight: 1.3,
    },
  },
}));

const UnknownTxHeader = ({ tx, lastOne }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <Block padding={1} bgcolor={itemBackground}>
      <ListItem>
        <Block width="30px" textAlign="center">
          <MarkunreadMailbox fontSize="default" color="primary" />
        </Block>
        <Block paddingLeft={2}>
          <ListItemText
            className={classes.msg}
            primary={
              <Typography variant="body2" inline>
                {`Transaction of unsupported type ${tx.original.kind}`}
              </Typography>
            }
            secondary={tx.time.toLocaleString()}
          />
        </Block>
      </ListItem>
      {!lastOne && (
        <Block padding="md">
          <Hairline />
        </Block>
      )}
    </Block>
  );
};

export default UnknownTxHeader;
