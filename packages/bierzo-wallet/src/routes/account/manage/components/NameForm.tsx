import { ActionMenuItem } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import AccountManage, { BwUsernameWithChainName } from "../../../../components/AccountManage";
import { NAME_EDIT_ROUTE, REGISTER_IOVNAME_ROUTE, STARNAME_REGISTER_ROUTE } from "../../../paths";

function onRegisterUsername(): void {
  history.push(REGISTER_IOVNAME_ROUTE);
}

function onRegisterStarname(): void {
  history.push(STARNAME_REGISTER_ROUTE);
}

const menuItems: readonly ActionMenuItem[] = [{ title: "Renew", action: () => console.log("Delete") }];

const NameAccountManage = (): JSX.Element => {
  const aadressToManage: BwUsernameWithChainName | undefined = history.location.state;

  if (!aadressToManage) {
    throw new Error("No address to manage provided, something wrong.");
  }

  const onEditAccount = (): void => {
    history.push(NAME_EDIT_ROUTE, aadressToManage);
  };

  return <AccountManage menuItems={menuItems} onEditAccount={onEditAccount} account={aadressToManage} />;
};

export default NameAccountManage;
