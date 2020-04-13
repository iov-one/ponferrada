import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { BwAccountWithChainName } from "../../components/AccountManage";
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
  const accounts = ReactRedux.useSelector((state: RootState) => state.accounts);
  const rpcEndpointType = ReactRedux.useSelector(getRpcEndpointType);
  const [bwAccountsWithChain, setBwAccountsWithChain] = React.useState<readonly BwAccountWithChainName[]>([]);

  React.useEffect(() => {
    let isSubscribed = true;
    async function insertChainNames(): Promise<void> {
      if (isSubscribed) {
        const newBwAccountsWithChain: BwAccountWithChainName[] = await Promise.all(
          accounts.map(async account => {
            return {
              ...account,
              addresses: await Promise.all(
                account.addresses.map(async address => {
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

        setBwAccountsWithChain(newBwAccountsWithChain);
      }
    }
    insertChainNames();

    return () => {
      isSubscribed = false;
    };
  }, [accounts]);

  const supportedChains = React.useMemo(
    () =>
      Array.from(identities.values()).map(extendedIdentity => ({
        chainId: extendedIdentity.identity.chainId,
        name: extendedIdentity.chainName,
      })),
    [identities],
  );

  const chainAddresses = getChainAddressPairWithNames(identities, supportedChains);
  const iovnames = bwAccountsWithChain.filter(account => account.domain === "iov");
  const starnames = bwAccountsWithChain.filter(account => account.domain !== "iov");

  return (
    <PageMenu>
      <AddressesTab
        chainAddresses={chainAddresses}
        iovnames={iovnames}
        starnames={starnames}
        onRegisterIovname={onRegisterIovname}
        onRegisterStarname={onRegisterStarname}
        rpcEndpointType={rpcEndpointType}
      />
    </PageMenu>
  );
};

export default Addresses;
