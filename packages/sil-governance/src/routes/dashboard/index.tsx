import { Block, Hairline } from "medulas-react-components";
import React, { useEffect } from "react";
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

interface Props {
  filter: ElectionFilter;
}

const Dashboard = ({ filter }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const lastSignAndPostResult = useSelector((state: RootState) => state.transactions.lastSignAndPostResult);
  const governor = useSelector((state: RootState) => state.extension.governor);

  const onReturnToDashboard = (): void => {
    dispatch(setTransactionsStateAction());
    history.push(DASHBOARD_ROUTE);
  };

  useEffect(() => {
    const updateChainProposals = async (): Promise<void> => {
      // in DOM tests, governor is not set
      if (governor) {
        const chainProposals = await getProposals(governor);
        dispatch(replaceProposalsAction(chainProposals));
      }
    };

    updateChainProposals();
  }, [dispatch, governor]);

  return (
    <Block width="100%" maxWidth="1024px" height="auto" display="flex" flexDirection="column" margin="0 auto">
      <Header />
      <Hairline />
      {lastSignAndPostResult ? (
        <ConfirmTransaction transactionId={lastSignAndPostResult} onReturnToDashboard={onReturnToDashboard} />
      ) : (
        <Block minWidth="100%" display="flex">
          <AsideFilter filter={filter} />
          <ProposalsList filterType={filter} />
        </Block>
      )}
    </Block>
  );
};

export default Dashboard;
