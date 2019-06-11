import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import classNames from 'classnames';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import Block from '~/components/layout/Block';
import Hairline from '~/components/layout/Hairline';
import Typography from '~/components/layout/Typography';
import { BALANCE_ROUTE, CONFIRM_TRANSACTION, PAYMENT_ROUTE, TRANSACTIONS_ROUTE } from '~/routes';
import { history } from '~/store';
import { border, lg, primary } from '~/theme/variables';
import { TXS_FEATURE_FLAG } from '~/utils/features';

const styles = createStyles({
  root: {
    display: 'flex',
  },
  text: {
    marginTop: '12px',
  },
  item: {
    margin: `0px ${lg}`,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  activated: {
    '& $line': {
      visibility: 'visible',
    },
  },
  line: {
    visibility: 'hidden',
    height: '4px',
    backgroundColor: primary,
    borderRadius: '4px',
    marginTop: '4px',
  },
});

const onBalance = () => {
  history.push(BALANCE_ROUTE);
};

const onPayments = () => {
  history.push(PAYMENT_ROUTE);
};

const onTransactions = () => {
  history.push(TRANSACTIONS_ROUTE);
};

const BALANCE_TEXT = 'Balance';
const PAYMENT_TEXT = 'Payments';
const TRANSACTIONS_TEXT = 'Transactions';

interface MenuItemProps {
  readonly itemTitle: string;
  readonly onClick: () => void;
}

const PhoneLinkMenuItem = ({ itemTitle, onClick }: MenuItemProps) => (
  <ListItem button disableGutters onClick={onClick}>
    <ListItemText disableTypography>
      <Typography variant="body1">{itemTitle}</Typography>
    </ListItemText>
  </ListItem>
);

export const PhoneLinks = () => (
  <React.Fragment>
    <PhoneLinkMenuItem onClick={onBalance} itemTitle={BALANCE_TEXT} />
    <PhoneLinkMenuItem onClick={onPayments} itemTitle={PAYMENT_TEXT} />
    {TXS_FEATURE_FLAG && <PhoneLinkMenuItem onClick={onTransactions} itemTitle={TRANSACTIONS_TEXT} />}

    <Hairline color={border} margin="sm" />
  </React.Fragment>
);

const DesktopLinkMenuItem = ({ itemTitle, onClick }: MenuItemProps) => {
  const textStyle = {
    marginTop: '12px',
  };

  return (
    <Block style={textStyle}>
      <Typography variant="subtitle2" color="textPrimary" style={textStyle} onClick={onClick}>
        {itemTitle}
      </Typography>
    </Block>
  );
};

interface LinksProps extends RouteComponentProps<{}>, WithStyles<typeof styles> {}

const DesktopLinksComponent = ({ classes, location }: LinksProps) => {
  const { pathname: path } = location;
  const showBalance = path === BALANCE_ROUTE;
  const showTransactions = path === TRANSACTIONS_ROUTE;
  const showPayment = path === PAYMENT_ROUTE || path.startsWith(CONFIRM_TRANSACTION);

  const balanceClasses = classNames(classes.item, showBalance ? classes.activated : undefined);
  const paymentClasses = classNames(classes.item, showPayment ? classes.activated : undefined);
  const transactionsClasses = classNames(classes.item, showTransactions ? classes.activated : undefined);

  return (
    <Block className={classes.root}>
      <Block className={balanceClasses}>
        <DesktopLinkMenuItem onClick={onBalance} itemTitle={BALANCE_TEXT} />
        <Block className={classes.line} />
      </Block>
      <Block className={paymentClasses}>
        <DesktopLinkMenuItem onClick={onPayments} itemTitle={PAYMENT_TEXT} />
        <Block className={classes.line} />
      </Block>
      {TXS_FEATURE_FLAG && (
        <Block className={transactionsClasses}>
          <DesktopLinkMenuItem onClick={onTransactions} itemTitle={TRANSACTIONS_TEXT} />
          <Block className={classes.line} />
        </Block>
      )}
    </Block>
  );
};

export const LinksDesktop = withStyles(styles)(withRouter(DesktopLinksComponent));
