import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import { getFirstUsernameMigrated } from "../../store/usernames/selectors";
import { BALANCE_ROUTE, UPGRADE_ROUTE } from "../paths";

const CheckMigration = (): React.ReactElement => {
  const bnsUsernameMigrated = ReactRedux.useSelector(getFirstUsernameMigrated);
  const iovAddressWithNewChain = bnsUsernameMigrated ? bnsUsernameMigrated.username : undefined;

  if (iovAddressWithNewChain) {
    history.push(BALANCE_ROUTE);
  } else {
    history.push(UPGRADE_ROUTE);
  }

  return <div style={{ maxWidth: "500px", margin: "0 auto", padding: "50px" }}>LOADING...</div>;
};

export default CheckMigration;
