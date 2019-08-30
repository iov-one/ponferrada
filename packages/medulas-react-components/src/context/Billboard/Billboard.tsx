import { makeStyles, Theme } from "@material-ui/core";
import React from "react";

import Block from "../../components/Block";

const useStyles = makeStyles((theme: Theme) => ({
  billboard: {
    position: "relative",
  },
  message: {
    position: "absolute",
    zIndex: 99999,
  },
}));

interface Props {
  readonly show: boolean;
  readonly message: React.ReactNode;
  readonly children: React.ReactNode;
}

function Billboard({ show, children, message }: Props): JSX.Element {
  const classes = useStyles();

  const billboardMessage = (
    <Block
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      bgcolor="rgba(204, 204, 204, 0.5)"
      className={classes.message}
    >
      {message}
    </Block>
  );

  return (
    <Block className={classes.billboard}>
      {show ? billboardMessage : null}
      {children}
    </Block>
  );
}

export default Billboard;
