import { makeStyles } from "@material-ui/core";
import classNames from "classnames";
import { Block, Image, Typography } from "medulas-react-components";
import * as React from "react";

import sortDown from "../../../../assets/sortDown.svg";
import sortDownActive from "../../../../assets/sortDownActive.svg";
import sortUp from "../../../../assets/sortUp.svg";
import sortUpActive from "../../../../assets/sortUpActive.svg";
import { calculateOppositeOrder, ORDER_ASC, ORDER_DESC, SortingStateProps } from "../../../sorting";

const useStyles = makeStyles({
  header: {
    flex: 1,
    marginLeft: 10,
    cursor: "pointer",
  },
  alignRight: {
    justifyContent: "flex-end",
  },
});

interface Props extends SortingStateProps {
  readonly name: "Date";
  readonly alignRight?: boolean;
}

const TxSortableColumn = ({ name, order, orderBy, alignRight, onSort }: Props): JSX.Element => {
  const classes = useStyles();
  const headerClasses = classNames(classes.header, { [classes.alignRight]: alignRight });
  const sortOrder = orderBy === name ? order : undefined;

  return (
    <Block
      display="flex"
      alignItems="center"
      flexGrow={1}
      flexShrink={0}
      className={headerClasses}
      onClick={onSort(name, calculateOppositeOrder(order))}
    >
      <Block display="flex" flexDirection="column" padding={1}>
        <Image src={sortOrder === ORDER_ASC ? sortUpActive : sortUp} alt="Descending sort" />
        <Block margin={0.5} />
        <Image src={sortOrder === ORDER_DESC ? sortDownActive : sortDown} alt="Ascending sort" />
      </Block>
      <Typography variant="subtitle2" weight="semibold">
        {name}
      </Typography>
    </Block>
  );
};

export default TxSortableColumn;
