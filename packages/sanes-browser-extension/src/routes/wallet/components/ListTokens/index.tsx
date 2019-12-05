import { Amount } from "@iov/bcp";
import { Block, Hairline, List, ListItem, makeStyles, Typography } from "medulas-react-components";
import * as React from "react";

import noFundsIcon from "../../assets/noFunds.svg";
import EmptyList from "../EmptyList";
import TokenItems from "./TokenItems";

const listTitle = "Tokens";
const noFundsText = "You have no funds available";
const noFundsSubText = "Make your first deposit and your funds will appear here.";

const useStyles = makeStyles({
  boxBorder: {
    border: "none",
  },
});

interface Props {
  readonly balances: { [tokenTicker: string]: Amount };
}

const ListTokens = ({ balances }: Props): JSX.Element => {
  const classes = useStyles();

  const tokenTickers = Object.keys(balances).sort();
  const hasTokens = tokenTickers.length > 0;

  return (
    <List className={classes.boxBorder}>
      <Block marginLeft={1} marginRight={1}>
        <ListItem>
          <Typography variant="body1">{listTitle}</Typography>
        </ListItem>
      </Block>
      <Hairline color="#f3f3f3" />
      {hasTokens ? (
        <TokenItems balances={balances} />
      ) : (
        <EmptyList src={noFundsIcon} alt={`No ${listTitle}`} text={noFundsText} subText={noFundsSubText} />
      )}
    </List>
  );
};

export default ListTokens;
