import { Identity } from "@iov/bcp";
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
  const identities = ReactRedux.useSelector((state: RootState) => state.extension.identities);

  React.useEffect(() => {
    async function processIdentities(identities: { [chain: string]: Identity }): Promise<void> {
      setAddresses(await getChainAddressPair(identities));
    }

    processIdentities(identities);
  }, [identities]);

  return (
    <PageMenu>
      <Layout onReturnToBalance={onReturnToBalance} addresses={addresses} />
    </PageMenu>
  );
};

export default ReceivePayment;
