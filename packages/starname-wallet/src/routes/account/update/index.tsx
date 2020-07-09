import React from "react";
import * as ReactRedux from "react-redux";

import { AccountProps } from "..";
import { history } from "../..";
import PageMenu from "../../../components/PageMenu";
import { getConfig, SupportedChain } from "../../../config";
import { RootState } from "../../../store/reducers";
import { TRANSACTIONS_ROUTE } from "../../paths";
import ConfirmRegistration from "./components/ConfirmUpdate";
import IovnameAccountUpdate from "./components/IovnameForm";
import NameAccountUpdate from "./components/NameForm";
import { ChainAddressPairWithName } from "../../../components/AddressesTable";

function onSeeTransactions(): void {
  history.push(TRANSACTIONS_ROUTE);
}

const AccountUpdate = ({ entity }: AccountProps): JSX.Element => {
  const [transactionId, setTransactionId] = React.useState<string | null>(null);
  const [supportedChains, setSupportedChains] = React.useState<readonly SupportedChain[]>([]);

  const rpcEndpoint = ReactRedux.useSelector((state: RootState) => state.rpcEndpoint);
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);
  const addressesSorted: ChainAddressPairWithName[] = []; /*React.useMemo(
    () => getChainAddressPairWithNamesSorted(identities, supportedChains),
    [identities, supportedChains],
  )*/

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
  }, [addressesSorted]);

  return (
    <PageMenu>
      {transactionId ? (
        <ConfirmRegistration transactionId={transactionId} onSeeTransactions={onSeeTransactions} />
      ) : (
        <React.Fragment>
          {entity === "iovname" && (
            <IovnameAccountUpdate
              setTransactionId={setTransactionId}
              rpcEndpoint={rpcEndpoint}
              chainAddresses={addressesSorted}
            />
          )}
          {entity === "name" && (
            <NameAccountUpdate
              setTransactionId={setTransactionId}
              rpcEndpoint={rpcEndpoint}
              chainAddresses={addressesSorted}
            />
          )}
        </React.Fragment>
      )}
    </PageMenu>
  );
};

export default AccountUpdate;
