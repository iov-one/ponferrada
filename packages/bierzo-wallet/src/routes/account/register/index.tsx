import { TransactionId } from "@iov/bcp";
import React from "react";
import * as ReactRedux from "react-redux";

import { AccountProps } from "..";
import { history } from "../..";
import { BwUsernameWithChainName } from "../../../components/AccountManage";
import PageMenu from "../../../components/PageMenu";
import { getConfig, SupportedChain } from "../../../config";
import { RootState } from "../../../store/reducers";
import { getBnsIdentity, getChainAddressPairWithNamesSorted } from "../../../utils/tokens";
import { ADDRESSES_ROUTE, BALANCE_ROUTE, TRANSACTIONS_ROUTE } from "../../paths";
import ConfirmRegistration from "./components/ConfirmRegistration";
import IovnameForm from "./components/IovnameForm";
import NameForm from "./components/NameForm";
import StarnameForm from "./components/StarnameForm";

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
  const [transactionId, setTransactionId] = React.useState<TransactionId | null>(null);
  const [supportedChains, setSupportedChains] = React.useState<readonly SupportedChain[]>([]);

  const rpcEndpoint = ReactRedux.useSelector((state: RootState) => state.rpcEndpoint);
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);
  const addressesSorted = React.useMemo(
    () => getChainAddressPairWithNamesSorted(identities, supportedChains),
    [identities, supportedChains],
  );

  const bnsIdentity = getBnsIdentity(identities);
  const iovnameAddresses: BwUsernameWithChainName | undefined = history.location.state;

  if (!bnsIdentity) throw new Error("No BNS identity available.");
  if (!rpcEndpoint) throw new Error("RPC endpoint not set in redux store. This is a bug.");

  React.useEffect(() => {
    let isSubscribed = true;
    async function getSupportedChains(): Promise<void> {
      const config = await getConfig();

      if (isSubscribed) {
        setSupportedChains(config.supportedChains);
      }
    }
    getSupportedChains();

    return () => {
      isSubscribed = false;
    };
  }, [addressesSorted, bnsIdentity]);

  return (
    <PageMenu>
      {transactionId ? (
        <ConfirmRegistration transactionId={transactionId} onSeeTrasactions={onSeeTrasactions} />
      ) : (
        <React.Fragment>
          {entity === "iovname" && (
            <IovnameForm
              onCancel={iovnameAddresses ? onReturnToAddresses : onReturnToBalance}
              chainAddresses={addressesSorted}
              bnsIdentity={bnsIdentity}
              rpcEndpoint={rpcEndpoint}
              setTransactionId={setTransactionId}
            />
          )}
          {entity === "starname" && (
            <StarnameForm
              onCancel={iovnameAddresses ? onReturnToAddresses : onReturnToBalance}
              bnsIdentity={bnsIdentity}
              rpcEndpoint={rpcEndpoint}
              setTransactionId={setTransactionId}
            />
          )}
          {entity === "name" && (
            <NameForm
              onCancel={iovnameAddresses ? onReturnToAddresses : onReturnToBalance}
              chainAddresses={addressesSorted}
              bnsIdentity={bnsIdentity}
              rpcEndpoint={rpcEndpoint}
              setTransactionId={setTransactionId}
            />
          )}
        </React.Fragment>
      )}
    </PageMenu>
  );
};

export default Register;
