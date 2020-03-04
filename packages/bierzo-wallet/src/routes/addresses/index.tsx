import React, { useEffect, useState } from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { ChainAddressPairWithName } from "../../components/AddressesTable";
import PageMenu from "../../components/PageMenu";
import { getChainName } from "../../config";
import { RootState } from "../../store/reducers";
import { getRpcEndpointType } from "../../store/rpcendpoint/selectors";
import { BwUsername } from "../../store/usernames";
import { getChainAddressPairWithNames } from "../../utils/tokens";
import { REGISTER_PERSONALIZED_ADDRESS_ROUTE, REGISTER_STARNAME } from "../paths";
import AddressesTab from "./components/AddressesTab";

export interface BwUsernameWithChainName extends BwUsername {
  readonly addresses: readonly ChainAddressPairWithName[];
}

function onRegisterUsername(): void {
  history.push(REGISTER_PERSONALIZED_ADDRESS_ROUTE);
}

function onRegisterStarname(): void {
  history.push(REGISTER_STARNAME);
}

const Addresses = (): JSX.Element => {
  const bwNames = ReactRedux.useSelector((state: RootState) => state.usernames);
  const [bwNamesWithChain, setBwNamesWithChain] = useState<readonly BwUsernameWithChainName[]>([]);

  useEffect(() => {
    let isSubscribed = true;
    async function insertChainNames(): Promise<void> {
      if (isSubscribed) {
        const bwNamesWithChain: BwUsernameWithChainName[] = await Promise.all(
          bwNames.map(async name => {
            return {
              username: name.username,
              addresses: await Promise.all(
                name.addresses.map(async address => {
                  return {
                    chainId: address.chainId,
                    address: address.address,
                    chainName: await getChainName(address.chainId),
                  };
                }),
              ),
            };
          }),
        );

        setBwNamesWithChain(bwNamesWithChain);
      }
    }
    insertChainNames();

    return () => {
      isSubscribed = false;
    };
  }, [bwNames]);

  const rpcEndpointType = ReactRedux.useSelector(getRpcEndpointType);
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);

  const supportedChains = React.useMemo(
    () =>
      Array.from(identities.values()).map(extendedIdentity => ({
        chainId: extendedIdentity.identity.chainId,
        name: extendedIdentity.chainName,
      })),
    [identities],
  );

  const chainAddresses = getChainAddressPairWithNames(identities, supportedChains);

  return (
    <PageMenu>
      <AddressesTab
        chainAddresses={chainAddresses}
        usernames={bwNamesWithChain}
        starnames={[]}
        onRegisterUsername={onRegisterUsername}
        onRegisterStarname={onRegisterStarname}
        rpcEndpointType={rpcEndpointType}
      />
    </PageMenu>
  );
};

export default Addresses;
