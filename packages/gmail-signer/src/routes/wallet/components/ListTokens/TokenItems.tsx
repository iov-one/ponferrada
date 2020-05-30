import { Amount } from "@iov/bcp";
import { Block, ListItem, Typography } from "medulas-react-components";
import * as React from "react";
import { amountToString } from "ui-logic";

interface Props {
  readonly balances: { [tokenTicker: string]: Amount };
}

const TokenItems = ({ balances }: Props): JSX.Element => {
  const tokenTickers = Object.keys(balances).sort();

  return (
    <Block margin={1}>
      {tokenTickers.map(ticker => (
        <ListItem key={balances[ticker].tokenTicker}>
          <Typography variant="h5" weight="regular" color="primary">
            {`${amountToString(balances[ticker])}`}
          </Typography>
        </ListItem>
      ))}
    </Block>
  );
};

export default TokenItems;
