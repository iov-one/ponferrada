import { Address, Amount } from "@iov/bcp";
import { Block, PopupCopy, Typography } from "medulas-react-components";
import * as React from "react";
import { useContext, useState } from "react";
import { ellipsifyMiddle } from "ui-logic";

import SimplePageLayout, { defaultPageHeight } from "../../components/SimplePageLayout";
import { PersonaContext } from "../../context/PersonaProvider";
import { WALLET_STATUS_ROUTE } from "../paths";
import ListCollectibles from "./components/ListCollectibles";
import ListTokens from "./components/ListTokens";
import SidePanel from "./components/SidePanel";
import { toolbarHeight } from "./components/SidePanel/PanelDrawer";

const addressLabel = "IOV address: ";
export const addressId = "addressFieldId";

const AccountView = (): JSX.Element => {
  const [mouseOverAddress, setMouseOverAddress] = useState<boolean>(false);
  const persona = useContext(PersonaContext);

  let iovAddress = "" as Address;
  if (persona.accounts.length) {
    iovAddress = persona.accounts[0].iovAddress;
  }
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
  const awards: string[] = [];

  return (
    <SidePanel id={WALLET_STATUS_ROUTE}>
      <SimplePageLayout height={`calc(${defaultPageHeight}px - ${toolbarHeight}px)`}>
        <Block bgcolor="#fff" display="flex" padding="8px 24px">
          <Typography inline>{addressLabel}</Typography>
          <Block marginLeft={2} display="inline">
            <PopupCopy
              textToCopy={iovAddress}
              onMouseEnter={onMouseEnterAddress}
              onMouseLeave={onMouseLeaveAddress}
            >
              <Typography inline color={mouseOverAddress ? "primary" : undefined} id={addressId}>
                {ellipsifyMiddle(iovAddress, 16)}
              </Typography>
            </PopupCopy>
          </Block>
        </Block>
        <Block marginTop={3} />
        <ListTokens balances={balances} />
        <Block marginTop={3} />
        <ListCollectibles starnames={persona.starnames} awards={awards} />
        <Block marginTop={3} />
      </SimplePageLayout>
    </SidePanel>
  );
};

export default AccountView;
