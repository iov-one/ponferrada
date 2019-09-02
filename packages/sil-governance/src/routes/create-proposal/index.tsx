import { TransactionId } from "@iov/bcp";
import { Block, Hairline } from "medulas-react-components";
import React from "react";

import { history } from "..";
import AsideFilter from "../../components/AsideFilter";
import ConfirmTransaction from "../../components/ConfirmTransaction";
import Header from "../../components/Header";
import { DASHBOARD_ROUTE } from "../paths";
import ProposalForm from "./components/ProposalForm";

const onReturnToDashboard = (): void => {
  history.push(DASHBOARD_ROUTE);
};

const CreateProposal = (): JSX.Element => {
  const [transactionId, setTransactionId] = React.useState<TransactionId | null>(null);

  return (
    <Block width="100%" maxWidth="1024px" height="auto" display="flex" flexDirection="column" margin="0 auto">
      <Header />
      <Hairline />
      {transactionId ? (
        <ConfirmTransaction transactionId={transactionId} onReturnToDashboard={onReturnToDashboard} />
      ) : (
        <Block minWidth="100%" display="flex">
          <AsideFilter />
          <ProposalForm onTransactionIdChanged={setTransactionId} />
        </Block>
      )}
    </Block>
  );
};

export default CreateProposal;
