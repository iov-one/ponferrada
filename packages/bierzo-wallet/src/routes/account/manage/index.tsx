import { Block } from "medulas-react-components";
import * as React from "react";

import PageMenu from "../../../components/PageMenu";
import { AccountProps } from "../register";
import IovnameAccountManage from "./components/IovnameForm";
import NameAccountManage from "./components/NameForm";

const AccountManage = ({ entity }: AccountProps): JSX.Element => {
  return (
    <PageMenu>
      <Block marginTop={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        {entity === "iovname" && <IovnameAccountManage />}
        {entity === "name" && <NameAccountManage />}
      </Block>
    </PageMenu>
  );
};

export default AccountManage;
