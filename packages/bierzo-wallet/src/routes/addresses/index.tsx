import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import PageMenu from "../../components/PageMenu";
import { RootState } from "../../store/reducers";
import { getRpcEndpointType } from "../../store/rpcendpoint/selectors";
import { getFirstUsername } from "../../store/usernames/selectors";
import { getChainAddressPairWithNames } from "../../utils/tokens";
import { REGISTER_PERSONALIZED_ADDRESS_ROUTE } from "../paths";
import AddressesTab from "./components/AddressesTab";

function onRegisterUsername(): void {
  history.push(REGISTER_PERSONALIZED_ADDRESS_ROUTE);
}

const Addresses = (): JSX.Element => {
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);
  const bnsUsername = ReactRedux.useSelector(getFirstUsername);
  const rpcEndpointType = ReactRedux.useSelector(getRpcEndpointType);
  const iovAddress = bnsUsername ? bnsUsername.username : undefined;

  const chainAddresses = getChainAddressPairWithNames(identities);

  return (
    <PageMenu>
      <AddressesTab
        chainAddresses={chainAddresses}
        iovAddress={iovAddress}
        onRegisterUsername={onRegisterUsername}
        rpcEndpointType={rpcEndpointType}
      />
    </PageMenu>
  );
};

export default Addresses;
