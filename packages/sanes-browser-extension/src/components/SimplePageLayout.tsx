import { Block, makeStyles } from "medulas-react-components";
import * as React from "react";

export const defaultPageHeight = 500;

const useStyles = makeStyles({
  root: {
    backgroundColor: "#f5f7f9",
    overflow: "auto",
  },
});

interface Props {
  readonly id?: string;
  readonly children: React.ReactNode;
  readonly height?: string | number;
}

const SimplePageLayout = ({ id, children, height }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <Block
      id={id}
      height={height || defaultPageHeight}
      display="flex"
      flexDirection="column"
      className={classes.root}
    >
      {children}
    </Block>
  );
};

export default SimplePageLayout;
