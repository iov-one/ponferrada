import { Identity } from "@iov/bcp";
import { BillboardContext, PageColumn, ToastContext, ToastVariant } from "medulas-react-components";
import * as React from "react";
import * as ReactRedux from "react-redux";
import { Dispatch } from "redux";

import { history } from "..";
import { getExtensionStatus } from "../../communication/extension";
import { extensionRpcEndpoint } from "../../communication/extensionRpcEndpoint";
import { ledgerRpcEndpoint } from "../../communication/ledgerRpcEndpoint";
import { generateGetIdentitiesRequest } from "../../communication/requestgenerators";
import BillboardMessage from "../../components/BillboardMessage";
import { makeExtendedIdentities } from "../../config";
import { subscribeBalance } from "../../logic/balances";
import { drinkFaucetIfNeeded } from "../../logic/faucet";
import { subscribeTransaction } from "../../logic/transactions";
import { addBalancesAction, getBalances } from "../../store/balances";
import { setIdentities } from "../../store/identities";
import { setRpcEndpoint } from "../../store/rpcendpoint";
import { addTickersAction, getTokens } from "../../store/tokens";
import { addUsernamesAction, getUsernames } from "../../store/usernames/actions";
import { BALANCE_ROUTE } from "../paths";

export const loginBootSequence = async (
  identities: readonly Identity[],
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

/**
 * Tests if current environment has WebUSB available
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/USB
 */
function webUsbAvailable(): boolean {
  const nav: any = navigator;
  return typeof nav !== "undefined" && typeof nav.usb !== "undefined";
}

const Login = (): JSX.Element => {
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);
  const dispatch = ReactRedux.useDispatch();

  const onLogin = async (_: object): Promise<void> => {
    billboard.show(<BillboardMessage text={extensionRpcEndpoint.authorizeGetIdentitiesMessage} />);
    const { installed, connected, identities } = await getExtensionStatus();
    billboard.close();

    if (!installed) {
      toast.show(extensionRpcEndpoint.notAvailableMessage, ToastVariant.ERROR);
      return;
    }

    if (!connected) {
      toast.show(extensionRpcEndpoint.noMatchingIdentityMessage, ToastVariant.ERROR);
      return;
    }

    dispatch(setIdentities(await makeExtendedIdentities(identities)));
    dispatch(setRpcEndpoint(extensionRpcEndpoint));

    await loginBootSequence(identities, dispatch);

    history.push(BALANCE_ROUTE);
  };

  const onLoginWithLedger = async (): Promise<void> => {
    if (!webUsbAvailable()) {
      toast.show("Your browser does not support WebUSB", ToastVariant.ERROR);
      return;
    }

    billboard.show(<BillboardMessage text={ledgerRpcEndpoint.authorizeGetIdentitiesMessage} />);
    const request = await generateGetIdentitiesRequest(true);
    const identities = await ledgerRpcEndpoint.sendGetIdentitiesRequest(request);
    billboard.close();

    if (identities === undefined) {
      toast.show(ledgerRpcEndpoint.notAvailableMessage, ToastVariant.ERROR);
      return;
    }

    if (identities.length === 0) {
      toast.show(ledgerRpcEndpoint.noMatchingIdentityMessage, ToastVariant.ERROR);
      return;
    }

    dispatch(setIdentities(await makeExtendedIdentities(identities)));
    dispatch(setRpcEndpoint(ledgerRpcEndpoint));

    await loginBootSequence(identities, dispatch);

    history.push(BALANCE_ROUTE);
  };

  return (
    <PageColumn
      icon="white"
      primaryTitle="Welcome"
      secondaryTitle="to your IOV Wallet"
      subtitle="Continue to access your account"
      primaryNextLabel="Continue with Neuma"
      primaryNextClicked={onLogin}
      secondaryNextLabel="Continue with Ledger Nano S"
      secondaryNextClicked={onLoginWithLedger}
    />
  );
};

export default Login;
