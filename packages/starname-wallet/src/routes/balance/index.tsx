import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import PageMenu from "../../components/PageMenu";
import { RootState } from "../../store/reducers";
import { getFirstUsername } from "../../store/usernames/selectors";
import { IOVNAME_REGISTER_ROUTE } from "../paths";
import Layout from "./components";

function onRegisterIovname(): void {
  history.push(IOVNAME_REGISTER_ROUTE);
}

const Balance = (): JSX.Element => {
  const tokens = ReactRedux.useSelector((state: RootState) => state.balances);
  const bnsUsername = ReactRedux.useSelector(getFirstUsername);
  const iovAddress = bnsUsername ? bnsUsername.username : undefined;

  return (
    <PageMenu>
      <Layout onRegisterIovname={onRegisterIovname} iovAddress={iovAddress} balances={tokens} />
    </PageMenu>
  );
};

export default Balance;
