import { ActionMenuItem } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import AccountManage, { BwAccountWithChainName } from "../../../../components/AccountManage";
import { NAME_EDIT_ROUTE } from "../../../paths";

// eslint-disable-next-line no-console
const menuItems: readonly ActionMenuItem[] = [{ title: "Renew", action: () => console.log("Delete") }];

const NameAccountManage = (): JSX.Element => {
  const account: BwAccountWithChainName = history.location.state;

  const onEdit = (): void => {
    history.push(NAME_EDIT_ROUTE, account);
  };

  return <AccountManage menuItems={menuItems} onEdit={onEdit} account={account} hideExpiration />;
};

export default NameAccountManage;
