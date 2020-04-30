import { Amount } from "@iov/bcp";
import { Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, Image, Typography } from "medulas-react-components";
import React from "react";
import { amountToString } from "ui-logic";

import PageContent from "../../../components/PageContent";
import wallet from "../assets/wallet.svg";

const walletIcon = <Image src={wallet} alt="wallet ico" />;

interface Props {
  readonly iovAddress?: string;
  readonly iovAddressWithNewChain?: string;
  readonly balances: { [token: string]: Amount };
  readonly onRegisterIovname: () => void;
  readonly onUpgradeIovname?: () => void;
}

const BalanceLayout = ({
  iovAddress,
  balances,
  onRegisterIovname,
  onUpgradeIovname,
  iovAddressWithNewChain,
}: Props): JSX.Element => {
  const tickersList = Object.keys(balances).sort();
  const hasTokens = tickersList.length > 0;
  const theme = useTheme<Theme>();
  return (
    <Block alignSelf="center">
      <Block margin={2} />
      {!iovAddressWithNewChain && (
        <>
          {!iovAddress && (
            <Block
              width={500}
              bgcolor={theme.palette.background.paper}
              padding={5}
              display="flex"
              flexDirection="column"
              borderRadius={5}
              textAlign="center"
              border="1px solid #F3F3F3"
              fontSize={24}
            >
              <Block marginTop={3} />
              <Typography variant="h5" weight="semibold" gutterBottom>
                You need to register an iovname
                <br /> to migrate to the Starname Service.
              </Typography>
              <br />
              <Typography variant="body1" color="textPrimary">
                1. Register your iovname by clicking on the button below
                <br />
                <br />
                2. After the registration is successfull, we will contact you for the migration to the
                Starname Service.
              </Typography>
              <Block marginTop={3} />
              <Typography
                variant="subtitle1"
                color="primary"
                weight="semibold"
                inline
                link
                onClick={onRegisterIovname}
              >
                Register Now
              </Typography>
            </Block>
          )}
          {iovAddress && (
            <Block
              width={500}
              bgcolor={theme.palette.background.paper}
              padding={5}
              display="flex"
              flexDirection="column"
              borderRadius={5}
              textAlign="center"
              border="1px solid #F3F3F3"
              fontSize={18}
            >
              <Typography variant="h5" weight="semibold" gutterBottom>
                You need to upgrade your iovname
                <br /> to migrate to the Starname Service.
              </Typography>
              <br />
              <br />
              Please click on the button below to upgrade your iovname to be able to migrate to the Starname
              Service.
              <br />
              <br />
              <Typography
                variant="subtitle1"
                color="primary"
                weight="semibold"
                inline
                link
                onClick={onUpgradeIovname}
              >
                Upgrade Now
              </Typography>
            </Block>
          )}
        </>
      )}
      {iovAddressWithNewChain && (
        <>
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
        </>
      )}
    </Block>
  );
};

export default BalanceLayout;
