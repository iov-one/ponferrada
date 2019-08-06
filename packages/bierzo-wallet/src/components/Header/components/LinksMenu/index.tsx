import { makeStyles, Theme } from "@material-ui/core";
import classNames from "classnames";
import Block from "medulas-react-components/lib/components/Block";
import Typography from "medulas-react-components/lib/components/Typography";
import * as React from "react";

import { history } from "../../../../routes";
import {
  ADDRESSES_ROUTE,
  BALANCE_ROUTE,
  CONFIRM_TRANSACTION_ROUTE,
  PAYMENT_ROUTE,
  TRANSACTIONS_ROUTE,
} from "../../../../routes/paths";

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

const onPayments = (): void => {
  history.push(PAYMENT_ROUTE);
};

const onAddresses = (): void => {
  history.push(ADDRESSES_ROUTE);
};

const onTransactions = (): void => {
  history.push(TRANSACTIONS_ROUTE);
};

const BALANCE_TEXT = "Balance";
const PAYMENT_TEXT = "Payments";
const ADDRESSES_TEXT = "Addresses";
export const TRANSACTIONS_TEXT = "Transactions";

interface MenuItemProps {
  readonly itemTitle: string;
  readonly onClick: () => void;
}

const LinkMenuItem = ({ itemTitle, onClick }: MenuItemProps): JSX.Element => (
  <Block marginTop="12px">
    <Block marginTop="12px">
      <Typography variant="subtitle2" color="textPrimary" onClick={onClick} id={itemTitle}>
        {itemTitle}
      </Typography>
    </Block>
  </Block>
);

interface Props {
  readonly path: string;
}

const LinksMenu = ({ path }: Props): JSX.Element => {
  const classes = useStyles();
  const showBalance = path === BALANCE_ROUTE;
  const showTransactions = path === TRANSACTIONS_ROUTE;
  const showPayment = path === PAYMENT_ROUTE || path.startsWith(CONFIRM_TRANSACTION_ROUTE);
  const showAddresses = path === ADDRESSES_ROUTE;

  const balanceClasses = classNames(classes.item, showBalance ? classes.activated : undefined);
  const paymentClasses = classNames(classes.item, showPayment ? classes.activated : undefined);
  const addressesClasses = classNames(classes.item, showAddresses ? classes.activated : undefined);
  const transactionsClasses = classNames(classes.item, showTransactions ? classes.activated : undefined);

  return (
    <Block className={classes.root}>
      <Block className={balanceClasses}>
        <LinkMenuItem onClick={onBalance} itemTitle={BALANCE_TEXT} />
        <Block className={classes.line} />
      </Block>
      <Block className={paymentClasses}>
        <LinkMenuItem onClick={onPayments} itemTitle={PAYMENT_TEXT} />
        <Block className={classes.line} />
      </Block>
      <Block className={addressesClasses}>
        <LinkMenuItem onClick={onAddresses} itemTitle={ADDRESSES_TEXT} />
        <Block className={classes.line} />
      </Block>
      <Block className={transactionsClasses}>
        <LinkMenuItem onClick={onTransactions} itemTitle={TRANSACTIONS_TEXT} />
        <Block className={classes.line} />
      </Block>
    </Block>
  );
};

export default LinksMenu;
