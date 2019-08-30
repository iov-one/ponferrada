import { Identity } from "@iov/bcp";
import {
  BillboardContext,
  Block,
  PageColumn,
  ToastContext,
  ToastVariant,
  Typography,
} from "medulas-react-components";
import * as React from "react";
import * as ReactRedux from "react-redux";
import { Dispatch } from "redux";

import { history } from "..";
import { subscribeBalance } from "../../logic/balances";
import { drinkFaucetIfNeeded } from "../../logic/faucet";
import { subscribeTransaction } from "../../logic/transactions";
import { addBalancesAction, getBalances } from "../../store/balances";
import { getExtensionStatus, setExtensionStateAction } from "../../store/extension";
import { addTickersAction, getTokens } from "../../store/tokens";
import { addUsernamesAction, getUsernames } from "../../store/usernames/actions";
import { BALANCE_ROUTE } from "../paths";

export const INSTALL_EXTENSION_MSG = "You need to install IOV extension.";
export const LOGIN_EXTENSION_MSG = "Please login to the IOV extension to continue.";

export const loginBootSequence = async (
  identities: { [chain: string]: Identity },
  dispatch: Dispatch,
): Promise<void> => {
  const chainTokens = await getTokens();
  dispatch(addTickersAction(chainTokens));

  // Do not block the use of the wallet just because the faucet might take
  // some time send tokens
  drinkFaucetIfNeeded(identities).catch(console.error);

  const balances = await getBalances(identities);
  dispatch(addBalancesAction(balances));

  await subscribeBalance(identities, dispatch);
  await subscribeTransaction(identities, dispatch);

  const usernames = await getUsernames(identities);
  dispatch(addUsernamesAction(usernames));
};

const billboardMessage = (
  <Block bgcolor="white" padding={2}>
    <Typography variant="h6">Please interact with NEUMA extension before continue.</Typography>
  </Block>
);

const Login = (): JSX.Element => {
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);
  const dispatch = ReactRedux.useDispatch();
  const store = ReactRedux.useStore();

  const onLogin = async (_: object): Promise<void> => {
    billboard.show(billboardMessage);
    const result = await getExtensionStatus();
    billboard.close();
    dispatch(setExtensionStateAction(result.connected, result.installed, result.identities));

    if (!result.installed) {
      toast.show(INSTALL_EXTENSION_MSG, ToastVariant.ERROR);
      return;
    }

    if (!result.connected) {
      toast.show(LOGIN_EXTENSION_MSG, ToastVariant.ERROR);
      return;
    }

    const identities = store.getState().extension.identities;
    await loginBootSequence(identities, dispatch);

    history.push(BALANCE_ROUTE);
  };

  return (
    <PageColumn
      icon="white"
      onSubmit={onLogin}
      primaryTitle="Welcome"
      secondaryTitle="to your IOV Wallet"
      subtitle="Continue to access your account"
      nextMsg="Continue"
    />
  );
};

export default Login;
