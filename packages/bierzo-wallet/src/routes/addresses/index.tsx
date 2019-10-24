import React from "react";
import * as ReactRedux from "react-redux";

import PageMenu from "../../components/PageMenu";
import { RootState } from "../../store/reducers";
import { getChainAddressPairWithNames } from "../../utils/tokens";
import UserAddresses from "./components/UserAddresses";

const Addresses = (): JSX.Element => {
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);
  const chainAddresses = getChainAddressPairWithNames(identities);

  return (
    <PageMenu>
      <UserAddresses chainAddresses={chainAddresses} />
    </PageMenu>
  );
};

export default Addresses;
