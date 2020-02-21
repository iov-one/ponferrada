import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { ChainAddressPairWithName } from "../../components/AddressesTable";
import PageMenu from "../../components/PageMenu";
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

  const supportedChains = React.useMemo(
    () =>
      Array.from(identities.values()).map(extendedIdentity => ({
        chainId: extendedIdentity.identity.chainId,
        name: extendedIdentity.chainName,
      })),
    [identities],
  );

  const chainAddresses = getChainAddressPairWithNames(identities, supportedChains);
  const iovnames = ReactRedux.useSelector((state: RootState) => state.usernames);
  const starnames = ReactRedux.useSelector((state: RootState) => state.accounts);
  const rpcEndpointType = ReactRedux.useSelector(getRpcEndpointType);

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
