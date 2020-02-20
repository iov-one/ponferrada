import { ActionMenuItem, Block } from "medulas-react-components";
import * as React from "react";

import { history } from "..";
import PageMenu from "../../components/PageMenu";
import { BwUsernameWithChainName } from "../addresses";
import { REGISTER_IOVNAME_ROUTE, REGISTER_STARNAME_ROUTE } from "../paths";
import ManageName from "./ManageName";

function onRegisterUsername(): void {
  history.push(REGISTER_IOVNAME_ROUTE);
}

function onRegisterStarname(): void {
  history.push(REGISTER_STARNAME_ROUTE);
}

const menuItems: readonly ActionMenuItem[] = [
  { title: "Renew", action: () => console.log("Renew") },
  { title: "Transfer iovname", action: () => console.log("Transfer iovname") },
  { title: "Delete iovname", action: () => console.log("Delete iovname") },
];

const AddressManage = (): JSX.Element => {
  const aadressToManage: BwUsernameWithChainName | undefined = history.location.state;

  if (!aadressToManage) {
    throw new Error("No address to manage provided, something wrong.");
  }

  return (
    <PageMenu>
      <Block marginTop={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <ManageName menuItems={menuItems} account={aadressToManage} onRegisterUsername={onRegisterUsername} />
      </Block>
    </PageMenu>
  );
};

export default AddressManage;
