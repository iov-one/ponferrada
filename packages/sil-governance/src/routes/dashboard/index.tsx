import { Block, Hairline } from "medulas-react-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { history } from "..";
import AsideFilter, { ElectionFilter } from "../../components/AsideFilter";
import ConfirmTransaction from "../../components/ConfirmTransaction";
import Header from "../../components/Header";
import { getProposals, replaceProposalsAction } from "../../store/proposals";
import { RootState } from "../../store/reducers";
import { setTransactionsStateAction } from "../../store/transactions";
import { DASHBOARD_ROUTE } from "../paths";
import ProposalsList from "./components/ProposalsList";

const Dashboard = (): JSX.Element => {
  const [filter, setFilter] = useState(ElectionFilter.All);
  const dispatch = useDispatch();
  const lastSignAndPostResult = useSelector((state: RootState) => state.transactions.lastSignAndPostResult);
  const governor = useSelector((state: RootState) => state.extension.governor);

  const onReturnToDashboard = (): void => {
    dispatch(setTransactionsStateAction());
    history.push(DASHBOARD_ROUTE);
  };

  const updateFilter = (filter: ElectionFilter): void => {
    setFilter(filter);
  };

  useEffect(() => {
    const updateChainProposals = async (): Promise<void> => {
      if (!governor) throw new Error("Governor not set in store. This is a bug.");
      const chainProposals = await getProposals(governor);
      dispatch(replaceProposalsAction(chainProposals));
    };

    updateChainProposals();
  }, [dispatch, filter, governor]);

  return (
    <Block width="100%" maxWidth="1024px" height="auto" display="flex" flexDirection="column" margin="0 auto">
      <Header />
      <Hairline />
      {lastSignAndPostResult ? (
        <ConfirmTransaction transactionId={lastSignAndPostResult} onReturnToDashboard={onReturnToDashboard} />
      ) : (
        <Block minWidth="100%" display="flex">
          <AsideFilter onChangeFilter={updateFilter} />
          <ProposalsList filterType={filter} />
        </Block>
      )}
    </Block>
  );
};

export default Dashboard;
