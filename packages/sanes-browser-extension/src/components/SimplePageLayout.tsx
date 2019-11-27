import { Block, makeStyles } from "medulas-react-components";
import * as React from "react";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#f5f7f9",
  },
});

interface Props {
  readonly id?: string;
  readonly children: React.ReactNode;
}

const SimplePageLayout = ({ id, children }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <Block id={id} display="flex" flexDirection="column" minHeight="100%" className={classes.root}>
      {children}
    </Block>
  );
};

export default SimplePageLayout;
