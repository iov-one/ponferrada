import { ActionMenuItem } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import AccountManage, { BwUsernameWithChainName } from "../../../../components/AccountManage";
import { IOVNAME_EDIT_ROUTE, IOVNAME_TRANSFER_ROUTE } from "../../../paths";

const IovnameAccountManage = (): JSX.Element => {
  const account: BwUsernameWithChainName = history.location.state;

  const menuItems: readonly ActionMenuItem[] = [
    // eslint-disable-next-line no-console
    { title: "Renew", action: () => console.log("Renew") },
    // eslint-disable-next-line no-console
    { title: "Transfer iovname", action: () => history.push(IOVNAME_TRANSFER_ROUTE, account) },
    // eslint-disable-next-line no-console
    { title: "Delete iovname", action: () => console.log("Delete iovname") },
  ];

  const onEdit = (): void => {
    history.push(IOVNAME_EDIT_ROUTE, account);
  };

  return <AccountManage menuItems={menuItems} onEdit={onEdit} account={account} />;
};

export default IovnameAccountManage;
