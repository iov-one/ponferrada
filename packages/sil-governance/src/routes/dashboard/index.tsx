import { Block, Hairline } from "medulas-react-components";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { history } from "..";
import AsideFilter from "../../components/AsideFilter";
import ConfirmTransaction from "../../components/ConfirmTransaction";
import Header from "../../components/Header";
import { replaceProposalsAction } from "../../store/proposals";
import { RootState } from "../../store/reducers";
import { setTransactionsStateAction } from "../../store/transactions";
import { DASHBOARD_ROUTE } from "../paths";
import ProposalsList from "./components/ProposalsList";

const Dashboard = (): JSX.Element => {
  const dispatch = useDispatch();
  const lastSignAndPostResult = useSelector((state: RootState) => state.transactions.lastSignAndPostResult);
  const proposals = useSelector((state: RootState) => state.proposals);

  const onReturnToDashboard = (): void => {
    dispatch(setTransactionsStateAction());
    history.push(DASHBOARD_ROUTE);
    dispatch(replaceProposalsAction(proposals));
  };

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
