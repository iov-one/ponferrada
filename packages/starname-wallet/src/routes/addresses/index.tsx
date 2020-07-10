import { Block } from "medulas-react-components";
import React from "react";

import PageMenu from "../../components/PageMenu";
import UserAddresses from "./components/UserAddresses";

export const ADDRESSES_VIEW_ID = "addresses-view-id";

const Addresses = (): React.ReactElement => {
  // const chainAddresses: ChainAddressPairWithName[] = getChainAddressPairWithNames(identities, supportedChains);

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
        <UserAddresses chainAddresses={[]} />
      </Block>
    </PageMenu>
  );
};

export default Addresses;
