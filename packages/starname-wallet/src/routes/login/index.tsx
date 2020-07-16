import { ledgerRpcEndpoint } from "communication/ledgerRpcEndpoint";
import { RpcEndpoint } from "communication/rpcEndpoint";
import LedgerBillboardMessage from "components/BillboardMessage/LedgerBillboardMessage";
import { getConfig } from "config";
import { Target } from "logic/api";
import { BillboardContext, ToastContext, ToastVariant } from "medulas-react-components";
import * as React from "react";
import * as ReactRedux from "react-redux";
import { Dispatch } from "redux";
import PageColumn from "routes/login/components/PageColumn";
import { getBalances, setBalancesAction } from "store/balances";
import { addTickersAction, getTokens } from "store/tokens";
import { ErrorParser } from "ui-logic";

import { history } from "..";
import { BALANCE_ROUTE } from "../paths";

interface Props {
  onSignedIn: (rpcEndpoint: RpcEndpoint) => void;
}

export const loginBootSequence = async (targets: readonly Target[], dispatch: Dispatch): Promise<void> => {
  const chains = (await getConfig()).chains;
  for (const target of targets) {
    const chain = chains.find(chain => chain.chainSpec.chainId === target.id);
    if (!chain) {
      throw new Error(`Chain with ${target.id} was not found.`);
    }
  }
  const chainTokens = await getTokens();
  dispatch(addTickersAction(chainTokens));
  // Do not block the use of the wallet just because the faucet might take
  // some time send tokens
  // drinkFaucetIfNeeded(targets).catch(console.error);
  const balances = await getBalances(targets);
  // await subscribeTransaction(targets, dispatch);
  dispatch(setBalancesAction(balances));
};

async function onGetNeumaExtension(): Promise<void> {
  const config = await getConfig();
  window.open(config.extensionLink, "_blank");
}

const Login: React.FC<Props> = (props: Props): React.ReactElement => {
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);
  const dispatch = ReactRedux.useDispatch();

  const onLoginWithLedger = async (): Promise<void> => {
    try {
      billboard.show(
        <LedgerBillboardMessage text={ledgerRpcEndpoint.authorizeGetIdentitiesMessage} />,
        "center",
        "center",
        100,
      );
      if (!(await ledgerRpcEndpoint.start())) {
        toast.show(ledgerRpcEndpoint.notAvailableMessage, ToastVariant.ERROR);
      } else {
        // dispatch(setIdentities(await makeExtendedIdentities(targets)));
        // dispatch(setRpcEndpoint(ledgerRpcEndpoint));
        props.onSignedIn(ledgerRpcEndpoint);
        // What?
        // await loginBootSequence(targets, dispatch);
        history.push(BALANCE_ROUTE);
      }
    } catch (error) {
      console.error(error);
      const message = ErrorParser.tryParseWeaveError(error) || "An unknown error occurred";
      toast.show(message, ToastVariant.ERROR);
    } finally {
      billboard.close();
    }
  };

  return (
    <PageColumn
      onLoginWithNeuma={() => undefined}
      onLoginWithLedger={onLoginWithLedger}
      onGetNeumaExtension={onGetNeumaExtension}
    />
  );
};

export default Login;
