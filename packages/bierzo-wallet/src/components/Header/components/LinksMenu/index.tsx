import { makeStyles, Theme } from "@material-ui/core";
import classNames from "classnames";
import { Badge, Block, Typography } from "medulas-react-components";
import * as React from "react";

import { ProcessedTx } from "../../../../logic/transactions/types/BwParser";
import { history } from "../../../../routes";
import { ADDRESSES_ROUTE, BALANCE_ROUTE, TRANSACTIONS_ROUTE } from "../../../../routes/paths";
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
  activated: {
    "& $line": {
      visibility: "visible",
    },
  },
  line: {
    visibility: "hidden",
    height: "4px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "4px",
    marginTop: "4px",
  },
}));

const onBalance = (): void => {
  history.push(BALANCE_ROUTE);
};

const onAddresses = (): void => {
  history.push(ADDRESSES_ROUTE);
};

const onTransactions = (): void => {
  history.push(TRANSACTIONS_ROUTE);
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

const BALANCE_TEXT = "Balances";
export const ADDRESSES_TEXT = "Addresses";
export const TRANSACTIONS_TEXT = "Transactions";

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
  const showBalance = path === BALANCE_ROUTE;
  const showTransactions = path === TRANSACTIONS_ROUTE;
  const showAddresses = path === ADDRESSES_ROUTE;

  const balanceClasses = classNames(classes.item, showBalance ? classes.activated : undefined);
  const addressesClasses = classNames(classes.item, showAddresses ? classes.activated : undefined);
  const transactionsClasses = classNames(classes.item, showTransactions ? classes.activated : undefined);

  const showBadge = calcTxBadgeVisibilityState(lastTx, getLastTx());

  return (
    <Block className={classes.root}>
      <Block className={balanceClasses}>
        <LinkMenuItem onClick={onBalance} itemTitle={BALANCE_TEXT} />
        <Block className={classes.line} />
      </Block>
      <Block className={addressesClasses}>
        <LinkMenuItem onClick={onAddresses} itemTitle={ADDRESSES_TEXT} />
        <Block className={classes.line} />
      </Block>
      <Block className={transactionsClasses}>
        <LinkMenuItem
          onClick={onTransactions}
          itemTitle={TRANSACTIONS_TEXT}
          badgeText="new"
          showBadge={showBadge}
        />
        <Block className={classes.line} />
      </Block>
    </Block>
  );
};

export default LinksMenu;
