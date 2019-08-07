import React from "react";

import { history } from "..";
import PageMenu from "../../components/PageMenu";
import { BALANCE_ROUTE } from "../paths";
import Layout from "./components";

async function onSubmit(values: object): Promise<void> {
  //console.log(values);
}

function onCancel(): void {
  history.push(BALANCE_ROUTE);
}

const RegisterUsername = (): JSX.Element => {
  return (
    <PageMenu>
      <Layout onSubmit={onSubmit} onCancel={onCancel} />
    </PageMenu>
  );
};

export default RegisterUsername;
