import { Amount } from "@iov/bcp";
import { Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, Image, Typography } from "medulas-react-components";
import React from "react";
import { amountToString } from "ui-logic";

import PageContent from "../../../components/PageContent";
import { GetYourAddress } from "../../iovnames/components/IovnamesNotExists";
import wallet from "../assets/wallet.svg";

const walletIcon = <Image src={wallet} alt="wallet ico" />;

interface Props {
  readonly iovAddress?: string;
  readonly balances: { [token: string]: Amount };
  readonly onRegisterIovname: () => void;
}

const BalanceLayout = ({ iovAddress, balances, onRegisterIovname }: Props): JSX.Element => {
  const tickersList = Object.keys(balances).sort();
  const hasTokens = tickersList.length > 0;
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
          <GetYourAddress onRegisterIovname={onRegisterIovname} />
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
