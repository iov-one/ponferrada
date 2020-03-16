import { ActionMenuItem } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import AccountManage, { BwAccountWithChainName } from "../../../../components/AccountManage";
import { IOVNAME_REGISTER_ROUTE, NAME_EDIT_ROUTE, STARNAME_REGISTER_ROUTE } from "../../../paths";

function onRegisterUsername(): void {
  history.push(IOVNAME_REGISTER_ROUTE);
}

function onRegisterStarname(): void {
  history.push(STARNAME_REGISTER_ROUTE);
}

const menuItems: readonly ActionMenuItem[] = [{ title: "Renew", action: () => console.log("Delete") }];

const NameAccountManage = (): JSX.Element => {
  const account: BwAccountWithChainName = history.location.state;

  const onEdit = (): void => {
    history.push(NAME_EDIT_ROUTE, account);
  };

  return <AccountManage menuItems={menuItems} onEdit={onEdit} account={account} hideExpiration />;
};

export default NameAccountManage;
