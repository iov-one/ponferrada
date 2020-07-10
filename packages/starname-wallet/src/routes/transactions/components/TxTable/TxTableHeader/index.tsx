import { Block, Hairline } from "medulas-react-components";
import * as React from "react";

import { SortingStateProps, TX_AMOUNT_COLUMN, TX_DATE_COLUMN } from "../../sorting";
import TxColumn from "./utils/TxColumn";
import TxSortableColumn from "./utils/TxSortableColumn";

const TxTableHeader = ({ orderBy, order, onSort }: SortingStateProps): React.ReactElement => (
  <React.Fragment>
    <Block margin={1} />
    <Block display="flex" alignItems="center" paddingLeft={3} paddingRight={3}>
      <TxColumn name="Transactions" />
      <Block flexGrow={1} />
      <TxSortableColumn name={TX_DATE_COLUMN} orderBy={orderBy} order={order} onSort={onSort} />
      <Block flexGrow={1} />
      <TxColumn name={TX_AMOUNT_COLUMN} alignRight />
    </Block>
    <Block margin={1} />
    <Hairline />
  </React.Fragment>
);

export default TxTableHeader;
