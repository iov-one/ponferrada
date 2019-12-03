import { Amount } from "@iov/bcp";
import { Block, PopupCopy, Typography } from "medulas-react-components";
import * as React from "react";
import { useContext } from "react";
import { ellipsifyMiddle } from "ui-logic";

import SimplePageLayout, { defaultPageHeight } from "../../components/SimplePageLayout";
import { PersonaContext } from "../../context/PersonaProvider";
import ListCollectibles from "./components/ListCollectibles";
import ListTokens from "./components/ListTokens";
import SidePanel from "./components/SidePanel";
import { toolbarHeight } from "./components/SidePanel/PanelDrawer";

const addressLabel = "IOV address: ";

const AccountView = (): JSX.Element => {
  const [mouseOverAddress, setMouseOverAddress] = React.useState<boolean>(false);
  const persona = useContext(PersonaContext);

  const iovAddress = persona.accounts[0].iovAddress;
  const balances: { [tokenTicker: string]: Amount } = {};

  for (const balance of persona.balances) {
    for (const amount of balance) {
      balances[amount.tokenTicker] = {
        quantity: amount.quantity,
        fractionalDigits: amount.fractionalDigits,
        tokenTicker: amount.tokenTicker,
      };
    }
  }

  const onMouseEnterAddress = (): void => setMouseOverAddress(true);
  const onMouseLeaveAddress = (): void => setMouseOverAddress(false);

  // TODO load from chain when iov-core API ready
  const starnames: string[] = [];
  const awards: string[] = [];

  return (
    <SidePanel>
      <SimplePageLayout height={`calc(${defaultPageHeight}px - ${toolbarHeight}px)`}>
        <Block bgcolor="#fff" display="flex" padding="8px 24px">
          <Typography inline>{addressLabel}</Typography>
          <Block marginLeft={2} display="inline">
            <PopupCopy
              textToCopy={iovAddress}
              onMouseEnter={onMouseEnterAddress}
              onMouseLeave={onMouseLeaveAddress}
            >
              <Typography inline color={mouseOverAddress ? "primary" : undefined}>
                {ellipsifyMiddle(iovAddress, 16)}
              </Typography>
            </PopupCopy>
          </Block>
        </Block>
        <Block marginTop={3} />
        <ListTokens balances={balances} />
        <Block marginTop={3} />
        <ListCollectibles starnames={starnames} awards={awards} />
        <Block marginTop={3} />
      </SimplePageLayout>
    </SidePanel>
  );
};

export default AccountView;
