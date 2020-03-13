import { ActionMenuItem } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import AccountManage, { BwUsernameWithChainName } from "../../../../components/AccountManage";
import { IOVNAME_EDIT_ROUTE, IOVNAME_REGISTER_ROUTE, STARNAME_REGISTER_ROUTE } from "../../../paths";

function onRegisterUsername(): void {
  history.push(IOVNAME_REGISTER_ROUTE);
}

function onRegisterStarname(): void {
  history.push(STARNAME_REGISTER_ROUTE);
}

const menuItems: readonly ActionMenuItem[] = [
  { title: "Renew", action: () => console.log("Renew") },
  { title: "Transfer iovname", action: () => console.log("Transfer iovname") },
  { title: "Delete iovname", action: () => console.log("Delete iovname") },
];

const IovnameAccountManage = (): JSX.Element => {
  const account: BwUsernameWithChainName = history.location.state;

  const onEdit = (): void => {
    history.push(IOVNAME_EDIT_ROUTE, account);
  };

  return <AccountManage menuItems={menuItems} onEdit={onEdit} account={account} />;
};

export default IovnameAccountManage;
