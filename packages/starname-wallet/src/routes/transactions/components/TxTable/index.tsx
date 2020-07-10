import { makeStyles } from "@material-ui/core";
import { Block } from "medulas-react-components";
import * as React from "react";

import { getShadowColor } from "../../../../theme/css";
import { TxTableProps } from "./rowTxBuilder";
import TxTableFooter from "./TxTableFooter";
import TxTableHeader from "./TxTableHeader";

const useStyles = makeStyles({
  panel: {
    boxShadow: `0 0 20px 0 ${getShadowColor()}`,
  },
});

function TxTable({
  onSort,
  orderBy,
  order,
  rows,
  onChangeRows,
  onNextPage,
  onPrevPage,
}: TxTableProps): React.ReactElement {
  const classes = useStyles();

  return (
    <Block display="flex">
      <Block
        display="flex"
        flexBasis="80%"
        flexShrink={0}
        flexDirection="column"
        marginTop={6}
        marginBottom={6}
        marginLeft="auto"
        marginRight="auto"
      >
        <Block
          display="flex"
          flexDirection="column"
          borderRadius="4px"
          bgcolor="white"
          className={classes.panel}
        >
          <TxTableHeader onSort={onSort} orderBy={orderBy} order={order} />
          <Block display="flex" flexDirection="column">
            {rows}
            <TxTableFooter onChangeRows={onChangeRows} onNextPage={onNextPage} onPrevPage={onPrevPage} />
          </Block>
        </Block>
      </Block>
    </Block>
  );
}

export default TxTable;
