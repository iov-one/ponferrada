import { makeStyles, Theme } from "@material-ui/core";
import { Badge, Block, Typography } from "medulas-react-components";
import * as React from "react";

import { ProcessedTx } from "../../../../logic/transactions/types/BwParser";
import { history } from "../../../../routes";
import {
  ADDRESSES_ROUTE,
  BALANCE_ROUTE,
  IOVNAME_ROUTE,
  TRANSACTIONS_ROUTE,
  UPGRADE_ROUTE,
} from "../../../../routes/paths";
import { getLastTx, TxMeta } from "../../../../utils/localstorage/transactions";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
  },
  text: {
    marginTop: "12px",
  },
  item: {
    margin: `0px ${theme.spacing(4)}px`,
    "&:hover": {
      cursor: "pointer",
    },
  },
  line: {
    height: "4px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "4px",
    marginTop: "4px",
  },
}));

const onBalance = (): void => {
  history.push(BALANCE_ROUTE);
};

// NOTE: disabled starnames
/*
const onStarnames = (): void => {
  history.push(STARNAME_ROUTE);
};
*/

const onIovnames = (): void => {
  history.push(IOVNAME_ROUTE);
};

const onTransactions = (): void => {
  history.push(TRANSACTIONS_ROUTE);
};

const onAddresses = (): void => {
  history.push(ADDRESSES_ROUTE);
};

const onUpgrade = (): void => {
  history.push(UPGRADE_ROUTE);
};
const lastTxNewer = (lastTx: TxMeta, lastStoredTx: TxMeta): boolean => {
  return lastTx.time.getTime() > lastStoredTx.time.getTime();
};

const calcTxBadgeVisibilityState = (
  lastTx: TxMeta | undefined,
  lastStoredTx: TxMeta | undefined,
): boolean => {
  if (!lastTx) {
    return false;
  }

  if (!lastStoredTx) {
    return true;
  }

  const isLastTxNewer = lastTxNewer(lastTx, lastStoredTx);
  if (isLastTxNewer) {
    return true;
  }

  if (lastTx.id !== lastStoredTx.id) {
    return true;
  }

  return false;
};

export const BALANCES_TAB_TITLE = "Balances";
export const STARNAMES_TAB_TITLE = "Starnames";
export const IOVNAMES_TAB_TITLE = "iovnames";
export const TRANSACTIONS_TAB_TITLE = "Transactions";
export const ADDRESSES_TAB_TITLE = "Addresses";
export const UPGRADE_TAB_TITLE = "Upgrade";

interface MenuItemProps {
  readonly showBadge?: boolean;
  readonly badgeText?: string;
  readonly itemTitle: string;
  readonly onClick: () => void;
}

const LinkMenuItem = ({ itemTitle, onClick, showBadge, badgeText }: MenuItemProps): JSX.Element => {
  const marginTop = showBadge ? "8px" : "12px";
  return (
    <Block marginTop={marginTop}>
      <Block marginTop={marginTop}>
        <Badge variant="text" badgeContent={badgeText} invisible={!showBadge}>
          <Typography variant="subtitle2" color="textPrimary" onClick={onClick} id={itemTitle}>
            {itemTitle}
          </Typography>
        </Badge>
      </Block>
    </Block>
  );
};

interface Props {
  readonly path: string;
  readonly lastTx?: ProcessedTx;
}

const LinksMenu = ({ path, lastTx }: Props): JSX.Element => {
  const classes = useStyles();

  const showBalances = path === BALANCE_ROUTE;
  // NOTE: disabled starnames
  // const showStarnames = path === STARNAME_ROUTE;
  const showIovnames = path === IOVNAME_ROUTE;
  const showTransactions = path === TRANSACTIONS_ROUTE;
  const showAddresses = path === ADDRESSES_ROUTE;

  const showBadge = calcTxBadgeVisibilityState(lastTx, getLastTx());

  return (
    <Block className={classes.root}>
      <Block className={classes.item}>
        <LinkMenuItem onClick={onBalance} itemTitle={BALANCES_TAB_TITLE} />
        {showBalances && <Block className={classes.line} />}
      </Block>
      <Block className={classes.item}>
        <LinkMenuItem onClick={onUpgrade} itemTitle={UPGRADE_TAB_TITLE} />
      </Block>
      {/* NOTE: disabled starnames */}
      {/* <Block className={classes.item}>
        <LinkMenuItem onClick={onStarnames} itemTitle={STARNAMES_TAB_TITLE} />
        {showStarnames && <Block className={classes.line} />}
      </Block> */}
      <Block className={classes.item}>
        <LinkMenuItem onClick={onIovnames} itemTitle={IOVNAMES_TAB_TITLE} />
        {showIovnames && <Block className={classes.line} />}
      </Block>
      <Block className={classes.item}>
        <LinkMenuItem
          onClick={onTransactions}
          itemTitle={TRANSACTIONS_TAB_TITLE}
          badgeText="new"
          showBadge={showBadge}
        />
        {showTransactions && <Block className={classes.line} />}
      </Block>
      <Block className={classes.item}>
        <LinkMenuItem onClick={onAddresses} itemTitle={ADDRESSES_TAB_TITLE} />
        {showAddresses && <Block className={classes.line} />}
      </Block>
    </Block>
  );
};

export default LinksMenu;
