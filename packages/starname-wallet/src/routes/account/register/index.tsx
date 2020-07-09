import React from "react";
import * as ReactRedux from "react-redux";

import { AccountProps } from "..";
import { history } from "../..";
import { BwUsernameWithChainName } from "components/AccountManage";
import PageMenu from "../../../components/PageMenu";
import { getConfig, SupportedChain } from "config";
import { RootState } from "store/reducers";
import { ADDRESSES_ROUTE, BALANCE_ROUTE, TRANSACTIONS_ROUTE } from "../../paths";
import ConfirmRegistration from "./components/ConfirmRegistration";
import { RpcEndpointContext } from "contexts/rpcEndpointContext";
import { RegisterFormSelector } from "routes/account/register/components/registerFormSelector";

function onSeeTrasactions(): void {
  history.push(TRANSACTIONS_ROUTE);
}
function onReturnToBalance(): void {
  history.push(BALANCE_ROUTE);
}
function onReturnToAddresses(): void {
  history.push(ADDRESSES_ROUTE);
}

const Register = ({ entity }: AccountProps): JSX.Element => {
  const [transactionId, setTransactionId] = React.useState<string | null>(null);
  const [supportedChains, setSupportedChains] = React.useState<readonly SupportedChain[]>([]);

  const rpcEndpoint = ReactRedux.useSelector((state: RootState) => state.rpcEndpoint);
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);
  const addressesSorted: any[] = []; /*React.useMemo(
    () => getChainAddressPairWithNamesSorted(identities, supportedChains),
    [identities, supportedChains],
  );*/

  const iovnameAddresses: BwUsernameWithChainName | undefined = history.location.state;

  if (!rpcEndpoint) throw new Error("RPC endpoint not set in redux store. This is a bug.");
  React.useEffect(() => {
    let isSubscribed = true;
    async function getSupportedChains(): Promise<void> {
      const config = await getConfig();
      if (isSubscribed) {
        setSupportedChains(config.supportedChains);
      }
    }
    // noinspection JSIgnoredPromiseFromCall
    getSupportedChains();

    return () => {
      isSubscribed = false;
    };
  }, [addressesSorted]);

  return (
    <PageMenu>
      {transactionId ? (
        <ConfirmRegistration transactionId={transactionId} onSeeTrasactions={onSeeTrasactions} />
      ) : (
        <RpcEndpointContext.Provider value={rpcEndpoint}>
          <RegisterFormSelector
            entity={entity}
            addresses={addressesSorted}
            setTransactionId={setTransactionId}
            onCancel={iovnameAddresses ? onReturnToAddresses : onReturnToBalance}
          />
        </RpcEndpointContext.Provider>
      )}
    </PageMenu>
  );
};

export default Register;
