import React from "react";
import { Block, Typography, makeStyles } from "medulas-react-components";

const useStyles = makeStyles({
  starnameHeader: {
    boxShadow: "0px 0px 14px #EDEFF4",
  },
});

export function NoStarnameHeader(): React.ReactElement {
  const classes = useStyles();
  return (
    <Block className={classes.starnameHeader} borderRadius={40} width={145} padding={1}>
      <Typography variant="subtitle1" weight="semibold" color="primary" align="center">
        *yourstarname
      </Typography>
    </Block>
  );
}
