import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import PageMenu from "../../components/PageMenu";
import { RootState } from "../../store/reducers";
import { getChainAddressPairWithNames } from "../../utils/tokens";
import { BALANCE_ROUTE } from "../paths";
import Layout from "./components";

function onReturnToBalance(): void {
  history.push(BALANCE_ROUTE);
}

const Addresses = (): JSX.Element => {
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);
  const chainAddresses = getChainAddressPairWithNames(identities);

  return (
    <PageMenu>
      <Layout onReturnToBalance={onReturnToBalance} chainAddresses={chainAddresses} />
    </PageMenu>
  );
};

export default Addresses;
