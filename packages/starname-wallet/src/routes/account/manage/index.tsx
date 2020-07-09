import { Block } from "medulas-react-components";
import * as React from "react";

import { AccountProps } from "..";
import PageMenu from "../../../components/PageMenu";
import IovnameAccountManage from "./components/IovnameForm";
import NameAccountManage from "./components/NameForm";
import StarnameAccountManage from "./components/StarnameForm";

const AccountManage = ({ entity }: AccountProps): React.ReactElement => {
  return (
    <PageMenu>
      <Block marginTop={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        {entity === "iovname" && <IovnameAccountManage />}
        {entity === "name" && <NameAccountManage />}
        {entity === "starname" && <StarnameAccountManage />}
      </Block>
    </PageMenu>
  );
};

export default AccountManage;
