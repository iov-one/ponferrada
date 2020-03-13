import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { BwAccountWithChainName, BwUsernameWithChainName } from "../../components/AccountManage";
import PageMenu from "../../components/PageMenu";
import { getChainName } from "../../config";
import { RootState } from "../../store/reducers";
import { getRpcEndpointType } from "../../store/rpcendpoint/selectors";
import { getChainAddressPairWithNames } from "../../utils/tokens";
import { IOVNAME_REGISTER_ROUTE, STARNAME_REGISTER_ROUTE } from "../paths";
import AddressesTab from "./components/AddressesTab";

function onRegisterIovname(): void {
  history.push(IOVNAME_REGISTER_ROUTE);
}

function onRegisterStarname(): void {
  history.push(STARNAME_REGISTER_ROUTE);
}

const Addresses = (): JSX.Element => {
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);
  const bwNames = ReactRedux.useSelector((state: RootState) => state.usernames);
  const starnames = ReactRedux.useSelector((state: RootState) => state.accounts);
  const rpcEndpointType = ReactRedux.useSelector(getRpcEndpointType);
  const [bwNamesWithChain, setBwNamesWithChain] = React.useState<readonly BwUsernameWithChainName[]>([]);
  const [bwAccountsWithChain, setBwAccountsWithChain] = React.useState<readonly BwAccountWithChainName[]>([]);

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

  React.useEffect(() => {
    let isSubscribed = true;
    async function insertChainNames(): Promise<void> {
      if (isSubscribed) {
        const bwAccountsWithChain: BwAccountWithChainName[] = await Promise.all(
          starnames.map(async name => {
            return {
              ...name,
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

        setBwAccountsWithChain(bwAccountsWithChain);
      }
    }
    insertChainNames();

    return () => {
      isSubscribed = false;
    };
  }, [starnames]);

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
        starnames={bwAccountsWithChain}
        onRegisterIovname={onRegisterIovname}
        iovnames={bwNamesWithChain}
        onRegisterStarname={onRegisterStarname}
        rpcEndpointType={rpcEndpointType}
      />
    </PageMenu>
  );
};

export default Addresses;
