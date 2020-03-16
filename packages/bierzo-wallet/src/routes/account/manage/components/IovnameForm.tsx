import { ActionMenuItem } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import AccountManage, { BwUsernameWithChainName } from "../../../../components/AccountManage";
import { IOVNAME_EDIT_ROUTE } from "../../../paths";

const menuItems: readonly ActionMenuItem[] = [
  // eslint-disable-next-line no-console
  { title: "Renew", action: () => console.log("Renew") },
  // eslint-disable-next-line no-console
  { title: "Transfer iovname", action: () => console.log("Transfer iovname") },
  // eslint-disable-next-line no-console
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
