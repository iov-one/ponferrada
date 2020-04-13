import { Address, Amount } from "@iov/bcp";
import { Block, PopupCopy, ToastContext, ToastVariant, Typography } from "medulas-react-components";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { ellipsifyMiddle } from "ui-logic";

import SimplePageLayout, { defaultPageHeight } from "../../components/SimplePageLayout";
import { PersonaContext } from "../../context/PersonaProvider";
import { WALLET_STATUS_ROUTE } from "../paths";
import ListCollectibles from "./components/ListCollectibles";
import ListTokens from "./components/ListTokens";
import SidePanel from "./components/SidePanel";
import { toolbarHeight } from "./components/SidePanel/PanelDrawer";
import { getNetworks } from "./components/SidePanel/PanelDrawer/components/Networks";

const addressLabel = "IOV address: ";
export const addressId = "addressFieldId";

const AccountView = (): JSX.Element => {
  const persona = useContext(PersonaContext);
  const toast = useContext(ToastContext);

  const [mouseOverAddress, setMouseOverAddress] = useState<boolean>(false);

  useEffect(() => {
    let isSubscribed = true;

    async function warnOfflineNetworks(): Promise<void> {
      const networks = await getNetworks(persona.connectedChains);
      const offlineNetworks = networks.filter(chain => !chain.connected).map(chain => chain.name);

      if (isSubscribed && offlineNetworks.length > 0) {
        toast.show("Unable to connect to " + offlineNetworks.join(", "), ToastVariant.WARNING);
      }
    }

    warnOfflineNetworks();

    return () => {
      isSubscribed = false;
    };
    // Next line makes eslint not add "toast" as a dependency, so that it does not render all the time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persona.connectedChains]);

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

  const showIovAddress = persona.connectedChains.length > 0;

  return (
    <SidePanel id={WALLET_STATUS_ROUTE}>
      <SimplePageLayout height={`calc(${defaultPageHeight}px - ${toolbarHeight}px)`}>
        {showIovAddress && (
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
        )}
        <Block marginTop={3} />
        <ListTokens balances={balances} />
        <Block marginTop={3} />
        <ListCollectibles starnames={persona.names} awards={awards} />
        <Block marginTop={3} />
      </SimplePageLayout>
    </SidePanel>
  );
};

export default AccountView;
