import { Theme } from "@material-ui/core";
import * as React from "react";

import makeStyles from "../../theme/utils/styles";
import { border } from "../../theme/utils/variables";
import Block from "../Block";

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 5,
    border: `1px solid ${border}`,
    boxSizing: "border-box",
    display: "inline-block",
    wordWrap: "break-word",
    width: "100%",
  },
}));

interface Props {
  readonly children: React.ReactNode;
}

const SectionComponent = ({ children }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <Block className={classes.content}>
      <Block margin={2} />
      <Block padding={2}>{children}</Block>
      <Block margin={2} />
    </Block>
  );
};

export default SectionComponent;
