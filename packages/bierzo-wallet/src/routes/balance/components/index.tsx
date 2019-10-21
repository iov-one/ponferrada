import { Amount } from "@iov/bcp";
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
  readonly onSendPayment: () => void;
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

const GetYourAddressWithExtension = ({ onRegisterUsername }: GetAddressExtensionProps): JSX.Element => (
  <React.Fragment>
    <Typography variant="h5" align="center" weight="light" inline>
      Get your human readable
    </Typography>
    <Typography
      id={REGISTER_PERSONALIZED_ADDRESS_ROUTE}
      variant="h5"
      align="center"
      color="primary"
      weight="light"
      inline
      link
      onClick={onRegisterUsername}
    >
      personalized address.
    </Typography>
  </React.Fragment>
);

const GetYourAddressWithLedger = (): JSX.Element => (
  <React.Fragment>
    <Typography variant="h5" align="center" weight="light">
      You can not register
    </Typography>
    <Typography
      id={REGISTER_PERSONALIZED_ADDRESS_ROUTE}
      variant="h5"
      align="center"
      color="primary"
      weight="light"
    >
      personalized address
    </Typography>
    <Block textAlign="center">
      <Typography variant="h5" weight="light" inline>
        using{" "}
      </Typography>
      <Typography variant="h5" weight="semibold" inline>
        Ledger Nano S
      </Typography>
    </Block>
  </React.Fragment>
);

const BalanceLayout = ({
  iovAddress,
  balances,
  onSendPayment,
  onRegisterUsername,
  rpcEndpointType,
}: Props): JSX.Element => {
  const tickersList = Object.keys(balances).sort();
  const hasTokens = tickersList.length > 0;
  const walletIcon = <Image src={wallet} alt="wallet ico" />;

  return (
    <Block alignSelf="center">
      <Block margin={2} />
      {!iovAddress && (
        <GetYourAddress onRegisterUsername={onRegisterUsername} rpcEndpointType={rpcEndpointType} />
      )}
      <Block margin={2} />
      <PageContent icon={walletIcon} width={450} avatarColor="#31E6C9">
        <Block display="flex" flexDirection="column">
          <Typography variant="subtitle2" align="center" color="textPrimary">
            {hasTokens ? "Your currencies" : "No funds available"}
          </Typography>
          <Block margin={1} />
          {tickersList.map(ticker => (
            <Typography
              key={balances[ticker].tokenTicker}
              variant="h5"
              weight="regular"
              color="primary"
              align="center"
              onClick={onSendPayment}
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
