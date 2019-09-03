import { Block, Hairline } from "medulas-react-components";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { history } from "..";
import AsideFilter, { ElectionFilter } from "../../components/AsideFilter";
import ConfirmTransaction from "../../components/ConfirmTransaction";
import Header from "../../components/Header";
import { RootState } from "../../store/reducers";
import { setTransactionsStateAction } from "../../store/transactions";
import {
  DASHBOARD_ACTIVE_ROUTE,
  DASHBOARD_ENDED_ROUTE,
  DASHBOARD_ROUTE,
  DASHBOARD_SUBMITTED_ROUTE,
} from "../paths";
import ProposalForm from "./components/ProposalForm";

const CreateProposal = (): JSX.Element => {
  const dispatch = useDispatch();
  const lastSignAndPostResult = useSelector((state: RootState) => state.transactions.lastSignAndPostResult);

  const onReturnToDashboard = (): void => {
    dispatch(setTransactionsStateAction());
    history.push(DASHBOARD_ROUTE);
  };

  const updateFilter = (filter: ElectionFilter): void => {
    switch (filter) {
      case ElectionFilter.Active:
        history.push(DASHBOARD_ACTIVE_ROUTE);
        break;
      case ElectionFilter.Submitted:
        history.push(DASHBOARD_SUBMITTED_ROUTE);
        break;
      case ElectionFilter.Ended:
        history.push(DASHBOARD_ENDED_ROUTE);
        break;
      default:
        history.push(DASHBOARD_ROUTE);
    }
  };

  return (
    <Block width="100%" maxWidth="1024px" height="auto" display="flex" flexDirection="column" margin="0 auto">
      <Header />
      <Hairline />
      {lastSignAndPostResult ? (
        <ConfirmTransaction transactionId={lastSignAndPostResult} onReturnToDashboard={onReturnToDashboard} />
      ) : (
        <Block minWidth="100%" display="flex">
          <AsideFilter filter={null} onChangeFilter={updateFilter} />
          <ProposalForm />
        </Block>
      )}
    </Block>
  );
};

export default CreateProposal;
