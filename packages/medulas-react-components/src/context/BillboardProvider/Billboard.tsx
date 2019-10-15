import { makeStyles, Theme } from "@material-ui/core";
import React from "react";

import Block from "../../components/Block";

export type VPosition = "center" | "start" | "end";
export type HPosition = "center" | "flex-start" | "flex-end";

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
  readonly vPosition: VPosition;
  readonly hPosition: HPosition;
}

function Billboard({ show, children, message, hPosition, vPosition }: Props): JSX.Element {
  const classes = useStyles();

  const billboardMessage = (
    <Block
      display="flex"
      flexDirection="row"
      justifyContent={hPosition}
      alignItems={vPosition}
      width="100%"
      height="100%"
      bgcolor="rgba(26, 26, 26, 0.3)"
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
