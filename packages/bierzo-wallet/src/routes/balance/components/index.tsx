import { Amount } from "@iov/bcp";
import { Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, Image, Typography } from "medulas-react-components";
import React from "react";
import { amountToString } from "ui-logic";

import { RpcEndpointType } from "../../../communication/rpcEndpoint";
import PageContent from "../../../components/PageContent";
import { REGISTER_PERSONALIZED_ADDRESS_ROUTE } from "../../paths";
import wallet from "../assets/wallet.svg";

interface Props {
  readonly iovAddress?: string;
  readonly balances: { [token: string]: Amount };
  readonly onRegisterUsername: () => void;
  readonly rpcEndpointType: RpcEndpointType;
}

interface GetAddressProps {
  readonly onRegisterUsername: () => void;
  readonly rpcEndpointType: RpcEndpointType;
}

const GetYourAddress = ({ rpcEndpointType, onRegisterUsername }: GetAddressProps): JSX.Element => {
  switch (rpcEndpointType) {
    case "extension":
      return <GetYourAddressWithExtension onRegisterUsername={onRegisterUsername} />;
    case "ledger":
      return <GetYourAddressWithLedger />;
  }
};

interface GetAddressExtensionProps {
  readonly onRegisterUsername: () => void;
}

function GetYourAddressWithExtension({ onRegisterUsername }: GetAddressExtensionProps): JSX.Element {
  return (
    <React.Fragment>
      <Typography variant="subtitle2" weight="semibold" color="primary">
        username*iov
      </Typography>
      <Block marginTop={4} />
      <Typography variant="subtitle1" weight="semibold" gutterBottom>
        Choose your address
      </Typography>
      <Typography variant="body2" color="textPrimary">
        With IOV you can choose your easy to read human readable address. No more complicated cryptography
        when sending to friends.
      </Typography>
      <Block marginTop={3} />
      <Typography
        id={REGISTER_PERSONALIZED_ADDRESS_ROUTE}
        variant="subtitle1"
        color="primary"
        weight="semibold"
        inline
        link
        onClick={onRegisterUsername}
      >
        Choose Now
      </Typography>
    </React.Fragment>
  );
}

function GetYourAddressWithLedger(): JSX.Element {
  return (
    <React.Fragment>
      <Typography variant="subtitle2" weight="semibold" color="primary">
        username*iov
      </Typography>
      <Block marginTop={4} />
      <Typography variant="body1" weight="light">
        You can not register
      </Typography>
      <Typography id={REGISTER_PERSONALIZED_ADDRESS_ROUTE} variant="body1" color="primary" weight="light">
        personalized address
      </Typography>
      <Block textAlign="center">
        <Typography variant="body1" weight="light" inline>
          using{" "}
        </Typography>
        <Typography variant="body1" weight="semibold" inline>
          Ledger Nano S
        </Typography>
      </Block>
    </React.Fragment>
  );
}

const BalanceLayout = ({ iovAddress, balances, onRegisterUsername, rpcEndpointType }: Props): JSX.Element => {
  const tickersList = Object.keys(balances).sort();
  const hasTokens = tickersList.length > 0;
  const walletIcon = <Image src={wallet} alt="wallet ico" />;
  const theme = useTheme<Theme>();

  return (
    <Block alignSelf="center">
      <Block margin={2} />
      {!iovAddress && (
        <Block
          width={450}
          bgcolor={theme.palette.background.paper}
          padding={5}
          display="flex"
          flexDirection="column"
          borderRadius={5}
          textAlign="center"
          border="1px solid #F3F3F3"
        >
          <GetYourAddress onRegisterUsername={onRegisterUsername} rpcEndpointType={rpcEndpointType} />
        </Block>
      )}
      <Block margin={2} />
      <PageContent icon={walletIcon} width={450} avatarColor="#31E6C9">
        <Block display="flex" flexDirection="column">
          <Typography variant="subtitle2" align="center" weight="semibold">
            {hasTokens ? "Your currencies" : "You have no funds available"}
          </Typography>
          <Block margin={1} />
          {tickersList.map(ticker => (
            <Typography
              key={balances[ticker].tokenTicker}
              variant="h5"
              weight="regular"
              color="primary"
              align="center"
              gutterBottom
            >
              {`${amountToString(balances[ticker])}`}
            </Typography>
          ))}
          <Block margin={1} />
        </Block>
      </PageContent>
    </Block>
  );
};

export default BalanceLayout;
