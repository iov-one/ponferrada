import { Address } from "@iov/bcp";
import { Electorate } from "@iov/bns";
import { Block, Hairline } from "medulas-react-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { history } from "..";
import AsideFilter from "../../components/AsideFilter";
import BlockchainTime from "../../components/BlockchainTime";
import ConfirmTransaction from "../../components/ConfirmTransaction";
import Header from "../../components/Header";
import { RootState } from "../../store/reducers";
import { setTransactionsStateAction } from "../../store/transactions";
import { DASHBOARD_ROUTE } from "../paths";
import ProposalForm from "./components/ProposalForm";

const CreateProposal = (): JSX.Element => {
  const dispatch = useDispatch();
  const lastSignAndPostResult = useSelector((state: RootState) => state.transactions.lastSignAndPostResult);
  const governor = useSelector((state: RootState) => state.extension.governor);
  const blockchain = useSelector((state: RootState) => state.blockchain);

  const address = governor ? governor.address : ("" as Address);
  const [electorates, setElectorates] = useState<readonly Electorate[]>([]);

  useEffect(() => {
    const updateElectorates = async (): Promise<void> => {
      // in DOM tests, governor is not set
      if (governor) {
        const electorates = await governor.getElectorates();
        setElectorates(electorates);
      }
    };
    updateElectorates();
  }, [governor]);

  const onReturnToDashboard = (): void => {
    dispatch(setTransactionsStateAction());
    history.push(DASHBOARD_ROUTE);
  };

  return (
    <Block width="100%" maxWidth="1024px" height="auto" display="flex" flexDirection="column" margin="0 auto">
      <Header address={address} electorates={electorates} />
      <Hairline />
      {lastSignAndPostResult ? (
        <ConfirmTransaction transactionId={lastSignAndPostResult} onReturnToDashboard={onReturnToDashboard} />
      ) : (
        <Block minWidth="100%" display="flex">
          <Block width="205px">
            <AsideFilter filter={null} />
            <Block marginTop={1} />
            <Hairline />
            <BlockchainTime
              lastBlockHeight={blockchain.lastBlockheight}
              lastBlockTime={blockchain.lastBlockTime}
            />
          </Block>
          <ProposalForm />
        </Block>
      )}
    </Block>
  );
};

export default CreateProposal;
