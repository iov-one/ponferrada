import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { ChainAddressPairWithName } from "../../components/AddressesTable";
import PageMenu from "../../components/PageMenu";
import { RootState } from "../../store/reducers";
import { getRpcEndpointType } from "../../store/rpcendpoint/selectors";
import { BwUsername } from "../../store/usernames";
import { getFirstUsername } from "../../store/usernames/selectors";
import { chainAddressPairSortedMapping, getChainAddressPairWithNames } from "../../utils/tokens";
import { REGISTER_PERSONALIZED_ADDRESS_ROUTE } from "../paths";
import AddressesTab from "./components/AddressesTab";

function onRegisterUsername(): void {
  history.push(REGISTER_PERSONALIZED_ADDRESS_ROUTE);
}

const Addresses = (): JSX.Element => {
  const bnsUsername = ReactRedux.useSelector(getFirstUsername);
  const rpcEndpointType = ReactRedux.useSelector(getRpcEndpointType);
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);
  const iovAddress = bnsUsername ? bnsUsername.username : undefined;
  const [usernameAddresses, setUsernameAddresses] = React.useState<readonly ChainAddressPairWithName[]>([]);

  const chainAddresses = getChainAddressPairWithNames(identities);

  React.useEffect(() => {
    let isSubscribed = true;
    async function getAddressesPairs(bnsUsername: BwUsername | undefined): Promise<void> {
      if (isSubscribed) {
        const chainAddresses = bnsUsername ? await chainAddressPairSortedMapping(bnsUsername.addresses) : [];
        setUsernameAddresses(chainAddresses);
      }
    }
    getAddressesPairs(bnsUsername);

    return () => {
      isSubscribed = false;
    };
  }, [bnsUsername]);

  return (
    <PageMenu>
      <AddressesTab
        chainAddresses={chainAddresses}
        usernameAddresses={usernameAddresses}
        iovAddress={iovAddress}
        onRegisterUsername={onRegisterUsername}
        rpcEndpointType={rpcEndpointType}
      />
    </PageMenu>
  );
};

export default Addresses;
