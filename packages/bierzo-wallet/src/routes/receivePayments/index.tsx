import React from "react";

import { history } from "..";
import PageMenu from "../../components/PageMenu";
import { BALANCE_ROUTE } from "../paths";
import Layout from "./components";

function onReturnToBalance(): void {
  history.push(BALANCE_ROUTE);
}

const ReceivePayment = (): JSX.Element => {
  return (
    <PageMenu>
      <Layout onReturnToBalance={onReturnToBalance} />
    </PageMenu>
  );
};

export default ReceivePayment;
