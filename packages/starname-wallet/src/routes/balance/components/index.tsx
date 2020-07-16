import { Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { Block, Image, Typography } from "medulas-react-components";
import React from "react";

import PageContent from "../../../components/PageContent";
import { GetYourAddress } from "../../iovnames/components/IovnamesNotExists";
import wallet from "../assets/wallet.svg";

const walletIcon = <Image src={wallet} alt="wallet ico" />;

interface Props {
  readonly iovAddress?: string;
  readonly balances: { [token: string]: number };
  readonly onRegisterIovname: () => void;
}

const BalanceLayout = ({ iovAddress, balances, onRegisterIovname }: Props): React.ReactElement => {
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
          {tickersList.map(
            (ticker: string): React.ReactElement => (
              <Typography
                key={ticker}
                variant="h5"
                weight="regular"
                color="primary"
                align="center"
                gutterBottom
              >
                {`${balances[ticker] / 1000000} ${ticker}`}
              </Typography>
            ),
          )}
          <Block margin={1} />
        </Block>
      </PageContent>
    </Block>
  );
};

export default BalanceLayout;
