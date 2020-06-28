import { makeStyles } from "@material-ui/core";
import classNames from "classnames";
import { Block, Typography } from "medulas-react-components";
import * as React from "react";

const useStyles = makeStyles({
  header: {
    flexBasis: "10px",
  },
  alignRight: {
    justifyContent: "flex-end",
  },
});

interface Props {
  readonly name: "Amount" | "Transactions";
  readonly alignRight?: boolean;
}

const TxColumn = ({ name, alignRight }: Props): JSX.Element => {
  const classes = useStyles();
  const headerClasses = classNames(classes.header, { [classes.alignRight]: alignRight });

  return (
    <Block display="flex" alignItems="center" flexGrow={1} flexShrink={0} className={headerClasses}>
      <Typography variant="subtitle2" weight="semibold">
        {name}
      </Typography>
    </Block>
  );
};

export default TxColumn;
