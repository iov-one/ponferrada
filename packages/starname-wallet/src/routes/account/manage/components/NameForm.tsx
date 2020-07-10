import { Block } from "medulas-react-components";
import * as React from "react";

import { history } from "../../..";
import AccountManage, { BwAccountWithChainName } from "../../../../components/AccountManage";
import { NAME_EDIT_ROUTE } from "../../../paths";

export const NAME_MANAGE_VIEW = "name-manage-view";

const NameAccountManage = (): React.ReactElement => {
  const account: BwAccountWithChainName = history.location.state;

  const onEdit = (): void => {
    history.push(NAME_EDIT_ROUTE, account);
  };

  return (
    <Block data-test={NAME_MANAGE_VIEW}>
      <AccountManage onEdit={onEdit} account={account} hideExpiration />
    </Block>
  );
};

export default NameAccountManage;
