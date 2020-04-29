import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import PageMenu from "../../components/PageMenu";
import { RootState } from "../../store/reducers";
import { getFirstUsername, getFirstUsernameWithNewChain } from "../../store/usernames/selectors";
import { IOVNAME_REGISTER_ROUTE } from "../paths";
import Layout from "./components";

function onRegisterIovname(): void {
  history.push(IOVNAME_REGISTER_ROUTE);
}

const Balance = (): JSX.Element => {
  const tokens = ReactRedux.useSelector((state: RootState) => state.balances);
  const bnsUsername = ReactRedux.useSelector(getFirstUsername);
  const bnsUsernameWithNewChain = ReactRedux.useSelector(getFirstUsernameWithNewChain);
  const iovAddress = bnsUsername ? bnsUsername.username : undefined;
  const iovAddressWithNewChain = bnsUsernameWithNewChain ? bnsUsernameWithNewChain.username : undefined;
  return (
    <PageMenu>
      <Layout
        onRegisterIovname={onRegisterIovname}
        iovAddress={iovAddress}
        balances={tokens}
        iovAddressWithNewChain={iovAddressWithNewChain}
      />
    </PageMenu>
  );
};

export default Balance;
