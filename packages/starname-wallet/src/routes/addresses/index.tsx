import { Block } from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";

import PageMenu from "../../components/PageMenu";
import { RootState } from "../../store/reducers";
import UserAddresses from "./components/UserAddresses";
import { ChainAddressPairWithName } from "../../components/AddressesTable";

export const ADDRESSES_VIEW_ID = "addresses-view-id";

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

  const chainAddresses: ChainAddressPairWithName[] = []; // getChainAddressPairWithNames(identities, supportedChains);

  return (
    <PageMenu>
      <Block
        id={ADDRESSES_VIEW_ID}
        marginTop={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <UserAddresses chainAddresses={chainAddresses} />
      </Block>
    </PageMenu>
  );
};

export default Addresses;
