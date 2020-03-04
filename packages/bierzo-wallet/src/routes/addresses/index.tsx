import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { ChainAddressPairWithName } from "../../components/AddressesTable";
import PageMenu from "../../components/PageMenu";
import { getChainName } from "../../config";
import { RootState } from "../../store/reducers";
import { getRpcEndpointType } from "../../store/rpcendpoint/selectors";
import { BwUsername } from "../../store/usernames";
import { getChainAddressPairWithNames } from "../../utils/tokens";
import { REGISTER_IOVNAME_ROUTE, REGISTER_STARNAME_ROUTE } from "../paths";
import AddressesTab from "./components/AddressesTab";

export interface BwUsernameWithChainName extends BwUsername {
  readonly addresses: readonly ChainAddressPairWithName[];
}

function onRegisterIovname(): void {
  history.push(REGISTER_IOVNAME_ROUTE);
}

function onRegisterStarname(): void {
  history.push(REGISTER_STARNAME_ROUTE);
}

const Addresses = (): JSX.Element => {
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);
  const bwNames = ReactRedux.useSelector((state: RootState) => state.usernames);
  const starnames = ReactRedux.useSelector((state: RootState) => state.accounts);
  const rpcEndpointType = ReactRedux.useSelector(getRpcEndpointType);
  const [bwNamesWithChain, setBwNamesWithChain] = React.useState<readonly BwUsernameWithChainName[]>([]);

  React.useEffect(() => {
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
        starnames={starnames}
        onRegisterIovname={onRegisterIovname}
        usernames={bwNamesWithChain}
        onRegisterStarname={onRegisterStarname}
        rpcEndpointType={rpcEndpointType}
      />
    </PageMenu>
  );
};

export default Addresses;
