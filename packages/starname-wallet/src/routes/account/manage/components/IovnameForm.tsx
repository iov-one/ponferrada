import { ActionMenuItem, Block } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import AccountManage, { BwUsernameWithChainName } from "../../../../components/AccountManage";
import { IOVNAME_EDIT_ROUTE, IOVNAME_TRANSFER_ROUTE } from "../../../paths";

export const IOVNAME_MANAGE_VIEW = "iovname-manage-view";

const IovnameAccountManage = (): React.ReactElement => {
  const account: BwUsernameWithChainName = history.location.state;

  const menuItems: readonly ActionMenuItem[] = [
    { title: "Transfer iovname", action: () => history.push(IOVNAME_TRANSFER_ROUTE, account) },
  ];

  const onEdit = (): void => {
    history.push(IOVNAME_EDIT_ROUTE, account);
  };

  return (
    <Block data-test={IOVNAME_MANAGE_VIEW}>
      <AccountManage menuItems={menuItems} onEdit={onEdit} account={account} />
    </Block>
  );
};

export default IovnameAccountManage;
