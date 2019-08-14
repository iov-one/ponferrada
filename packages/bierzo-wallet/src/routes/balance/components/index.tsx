import { Amount } from "@iov/bcp";
import { makeStyles, Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, Hairline, Image, Typography } from "medulas-react-components";
import React from "react";
import { amountToString } from "ui-logic";

import { ADDRESSES_ROUTE, PAYMENT_ROUTE } from "../../paths";
import receive from "../assets/transactionReceive.svg";
import send from "../assets/transactionSend.svg";

interface Props {
  readonly iovAddress?: string;
  readonly balances: { [token: string]: Amount };
  readonly onSendPayment: () => void;
  readonly onReceivePayment: () => void;
  readonly onRegisterUsername: () => void;
}

interface CardProps {
  readonly id: string;
  readonly text: string;
  readonly logo: string;
  readonly onAction?: () => void;
}

const useCardStyles = makeStyles({
  root: {
    cursor: "pointer",
  },
});

const Card = ({ id, text, logo, onAction }: CardProps): JSX.Element => {
  const theme = useTheme<Theme>();
  const classes = useCardStyles();

  return (
    <Block
      id={id}
      bgcolor={theme.palette.background.paper}
      display="flex"
      width={215}
      flexDirection="column"
      alignItems="center"
      height={90}
      justifyContent="center"
      onClick={onAction}
      className={classes.root}
    >
      <Image src={logo} height={36} width={36} alt={text} />
      <Typography>{text}</Typography>
    </Block>
  );
};

interface GetAddressProps {
  readonly onRegisterUsername: () => void;
}

const GetYourAddress = ({ onRegisterUsername }: GetAddressProps): JSX.Element => (
  <React.Fragment>
    <Typography variant="h5" align="center" weight="light" inline>
      Get your human readable
    </Typography>
    <Typography
      variant="h5"
      align="center"
      color="primary"
      weight="light"
      inline
      link
      onClick={onRegisterUsername}
    >
      address.
    </Typography>
  </React.Fragment>
);

const BalanceLayout = ({
  iovAddress,
  balances,
  onSendPayment,
  onReceivePayment,
  onRegisterUsername,
}: Props): JSX.Element => {
  const tickersList = Object.keys(balances).sort();
  const hasTokens = tickersList.length > 0;
  const theme = useTheme<Theme>();

  return (
    <Block alignSelf="center">
      <Block margin={2} />
      <Block display="flex" alignItems="center" justifyContent="center" width={450}>
        <Card id={PAYMENT_ROUTE} text="Send payment" logo={send} onAction={onSendPayment} />
        <Block flexGrow={1} />
        <Card id={ADDRESSES_ROUTE} text="Receive Payment" logo={receive} onAction={onReceivePayment} />
      </Block>
      <Block margin={2} />
      <Block flexGrow={1} />
      <Block bgcolor={theme.palette.background.paper} height="unset" width={450}>
        <Block padding={4} display="flex" flexDirection="column">
          {iovAddress ? (
            <Typography variant="h5" align="center" weight="light">
              {iovAddress}
            </Typography>
          ) : (
            <GetYourAddress onRegisterUsername={onRegisterUsername} />
          )}
          <Hairline space={4} />
          <Typography variant="subtitle2" align="center">
            {hasTokens ? "Your currencies" : "No funds available"}
          </Typography>
          <Block margin={2} />
          {tickersList.map(ticker => (
            <Typography
              key={balances[ticker].tokenTicker}
              link
              variant="h6"
              weight="regular"
              color="primary"
              align="center"
              onClick={onSendPayment}
            >
              {`${amountToString(balances[ticker])}`}
            </Typography>
          ))}
          <Block margin={1} />
        </Block>
      </Block>
    </Block>
  );
};

export default BalanceLayout;
