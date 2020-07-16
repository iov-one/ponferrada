import { RpcEndpoint } from "communication/rpcEndpoint";
import { useRpcEndpoint } from "contexts/rpcEndpointContext";
import { Coin } from "logic/api";
import React from "react";
import * as ReactRedux from "react-redux";
import { getFirstUsername } from "store/usernames/selectors";

import { history } from "..";
import PageMenu from "../../components/PageMenu";
import { IOVNAME_REGISTER_ROUTE } from "../paths";
import Layout from "./components";

function onRegisterIovname(): void {
  history.push(IOVNAME_REGISTER_ROUTE);
}

const knownTickers: { [name: string]: string } = {
  uvoi: "IOV",
};

const BalanceView = (): React.ReactElement => {
  const [balances, setBalances] = React.useState<{ [ticker: string]: number }>({});
  const rpcEndpoint: RpcEndpoint = useRpcEndpoint();
  // const tokens = ReactRedux.useSelector((state: RootState) => state.balances);
  const bnsUsername = ReactRedux.useSelector(getFirstUsername);
  const iovAddress = bnsUsername ? bnsUsername.username : undefined;
  React.useEffect(() => {
    rpcEndpoint.getBalances().then((balances: Coin[]) => {
      setBalances(
        balances.reduce((finalBalances: { [denom: string]: number }, balance: Coin) => {
          const ticker: string = knownTickers[balance.denom];
          return {
            [ticker]: balance.amount,
          };
        }, {}),
      );
    });
  }, [rpcEndpoint]);

  return (
    <PageMenu>
      <Layout onRegisterIovname={onRegisterIovname} iovAddress={iovAddress} balances={balances} />
    </PageMenu>
  );
};

export default BalanceView;
