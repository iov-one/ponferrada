import { Block, Hairline } from "medulas-react-components";
import React from "react";
import { useSelector } from "react-redux";

import { history } from "..";
import { store } from "../..";
import AsideFilter from "../../components/AsideFilter";
import ConfirmTransaction from "../../components/ConfirmTransaction";
import Header from "../../components/Header";
import { RootState } from "../../store/reducers";
import { setTransactionsStateAction } from "../../store/transactions";
import { DASHBOARD_ROUTE } from "../paths";
import ProposalsList from "./components/ProposalsList";

const onReturnToDashboard = (): void => {
  store.dispatch(setTransactionsStateAction());
  history.push(DASHBOARD_ROUTE);
};

const Dashboard = (): JSX.Element => {
  const lastSignAndPostResult = useSelector((state: RootState) => state.transactions.lastSignAndPostResult);

  return (
    <Block width="100%" maxWidth="1024px" height="auto" display="flex" flexDirection="column" margin="0 auto">
      <Header />
      <Hairline />
      {lastSignAndPostResult ? (
        <ConfirmTransaction transactionId={lastSignAndPostResult} onReturnToDashboard={onReturnToDashboard} />
      ) : (
        <Block minWidth="100%" display="flex">
          <AsideFilter />
          <ProposalsList />
        </Block>
      )}
    </Block>
  );
};

export default Dashboard;
