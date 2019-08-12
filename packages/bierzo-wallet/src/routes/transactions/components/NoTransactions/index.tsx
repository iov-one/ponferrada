import { Block, Image, Typography } from "medulas-react-components";
import * as React from "react";

import noTransactions from "../../assets/noTransactions.svg";

const NoTransactions = (): JSX.Element => (
  <Block display="flex" flexDirection="column" justifyContent="center" paddingTop="100px">
    <Image src={noTransactions} alt="No Transactions" />
    <Block margin={4} />
    <Block padding={2}>
      <Typography variant="subtitle1" weight="semibold" align="center">
        No transactions yet
      </Typography>
      <Block margin={0.5} />
      <Typography variant="subtitle1" color="textSecondary" align="center">
        Make your first transaction and it will appear here
      </Typography>
    </Block>
  </Block>
);

export default NoTransactions;
