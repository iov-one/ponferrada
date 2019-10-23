import { Address } from "@iov/bcp";
import { Electorate } from "@iov/bns";
import { Block, Hairline, Typography } from "medulas-react-components";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";

import { history } from "..";
import AsideFilter from "../../components/AsideFilter";
import BlockchainTime from "../../components/BlockchainTime";
import ConfirmTransaction from "../../components/ConfirmTransaction";
import Header from "../../components/Header";
import { RootState } from "../../store/reducers";
import { setTransactionsStateAction } from "../../store/transactions";
import { DASHBOARD_ROUTE } from "../paths";
import ElectorateMembers from "./components/ElectorateMembers";

interface Params {
  readonly electorateId: string;
}

const ShowElectorate = ({ match }: RouteComponentProps<Params>): JSX.Element => {
  const dispatch = useDispatch();
  const lastSignAndPostResult = useSelector((state: RootState) => state.transactions.lastSignAndPostResult);
  const governor = useSelector((state: RootState) => state.extension.governor);
  const blockchain = useSelector((state: RootState) => state.blockchain);

  const address = governor ? governor.address : ("" as Address);
  const [electorates, setElectorates] = useState<readonly Electorate[]>([]);
  const [electorate, setElectorate] = useState<Electorate>();

  useEffect(() => {
    let isSubscribed = true;

    const updateElectorates = async (): Promise<void> => {
      // in DOM tests, governor is not set
      if (governor && isSubscribed) {
        const electorates = await governor.getElectorates();
        setElectorates(electorates);
      }
    };
    updateElectorates();

    return () => {
      isSubscribed = false;
    };
  }, [governor]);

  useMemo(() => {
    const electorate = electorates.find(e => e.id === parseInt(match.params.electorateId, 10));
    setElectorate(electorate);
  }, [electorates, match.params.electorateId]);

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
          {!electorate && (
            <Block margin={2}>
              <Typography>Electorate not found</Typography>
            </Block>
          )}
          {electorate && <ElectorateMembers electorate={electorate} />}
        </Block>
      )}
    </Block>
  );
};

export default ShowElectorate;
