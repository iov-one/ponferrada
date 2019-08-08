import { ChainAddressPair } from "@iov/bns";
import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import PageMenu from "../../components/PageMenu";
import { RootState } from "../../store/reducers";
import { getChainAddressPair } from "../../utils/tokens";
import { BALANCE_ROUTE } from "../paths";
import Layout from "./components";

function onReturnToBalance(): void {
  history.push(BALANCE_ROUTE);
}

const ReceivePayment = (): JSX.Element => {
  const [addresses, setAddresses] = React.useState<ChainAddressPair[]>([]);
  const pubKeys = ReactRedux.useSelector((state: RootState) => state.extension.keys);

  React.useEffect(() => {
    async function processPubKeys(pubKeys: { [chain: string]: string }): Promise<void> {
      setAddresses(await getChainAddressPair(pubKeys));
    }

    processPubKeys(pubKeys);
  }, [pubKeys]);

  return (
    <PageMenu>
      <Layout onReturnToBalance={onReturnToBalance} addresses={addresses} />
    </PageMenu>
  );
};

export default ReceivePayment;
