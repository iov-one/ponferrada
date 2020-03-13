import { ActionMenuItem } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import AccountManage, { BwUsernameWithChainName } from "../../../../components/AccountManage";
import { IOVNAME_REGISTER_ROUTE, STARNAME_REGISTER_ROUTE } from "../../../paths";
import AssociatedNamesList from "./AssociatedNamesList";

function onRegisterUsername(): void {
  history.push(IOVNAME_REGISTER_ROUTE);
}

function onRegisterStarname(): void {
  history.push(STARNAME_REGISTER_ROUTE);
}

const menuItems: readonly ActionMenuItem[] = [
  { title: "Renew", action: () => console.log("Renew") },
  { title: "Transfer iovname", action: () => console.log("Transfer starname") },
  { title: "Delete iovname", action: () => console.log("Delete starname") },
];

const StarnameAccountManage = (): JSX.Element => {
  const addressToManage: BwUsernameWithChainName | undefined = history.location.state;

  if (!addressToManage) {
    throw new Error("No address to manage provided, something wrong.");
  }

  const onEditAccount = (): void => {
    history.push(IOVNAME_REGISTER_ROUTE, addressToManage);
  };

  const onRegisterName = (): void => {
    history.push(IOVNAME_REGISTER_ROUTE, addressToManage);
  };

  return (
    <React.Fragment>
      <AccountManage menuItems={menuItems} onEditAccount={onEditAccount} account={addressToManage} />
      <AssociatedNamesList names={[]} onRegisterName={onRegisterName} />
    </React.Fragment>
  );
};

export default StarnameAccountManage;
