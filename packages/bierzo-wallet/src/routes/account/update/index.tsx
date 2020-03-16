import { ChainId, Fee, Identity, TransactionId } from "@iov/bcp";
import { BnsConnection } from "@iov/bns";
import React from "react";
import * as ReactRedux from "react-redux";

import { AccountProps } from "..";
import { history } from "../..";
import { generateRegisterUsernameTxWithFee } from "../../../communication/requestgenerators";
import { ChainAddressPairWithName } from "../../../components/AddressesTable";
import PageMenu from "../../../components/PageMenu";
import { getConfig, SupportedChain } from "../../../config";
import { getConnectionForChainId } from "../../../logic/connection";
import { ExtendedIdentity } from "../../../store/identities";
import { RootState } from "../../../store/reducers";
import { getChainAddressPairWithNamesSorted } from "../../../utils/tokens";
import { TRANSACTIONS_ROUTE } from "../../paths";
import ConfirmRegistration from "./components/ConfirmUpdate";
import IovnameAccountUpdate from "./components/IovnameForm";
import NameAccountUpdate from "./components/NameForm";

function onSeeTrasactions(): void {
  history.push(TRANSACTIONS_ROUTE);
}

export function getBnsIdentity(identities: ReadonlyMap<ChainId, ExtendedIdentity>): Identity | undefined {
  for (const identity of Array.from(identities.values()).map(ext => ext.identity)) {
    if (getConnectionForChainId(identity.chainId) instanceof BnsConnection) {
      return identity;
    }
  }
  return undefined;
}

async function getPersonalizedAddressRegistrationFee(
  bnsIdentity: Identity,
  addresses: readonly ChainAddressPairWithName[],
): Promise<Fee | undefined> {
  const transactionWithFee = await generateRegisterUsernameTxWithFee(bnsIdentity, "feetest*iov", addresses);

  return transactionWithFee.fee;
}

const AccountUpdate = ({ entity }: AccountProps): JSX.Element => {
  const [transactionId, setTransactionId] = React.useState<TransactionId | null>(null);
  const [transactionFee, setTransactionFee] = React.useState<Fee | undefined>(undefined);
  const [supportedChains, setSupportedChains] = React.useState<readonly SupportedChain[]>([]);

  const rpcEndpoint = ReactRedux.useSelector((state: RootState) => state.rpcEndpoint);
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);
  const addressesSorted = React.useMemo(
    () => getChainAddressPairWithNamesSorted(identities, supportedChains),
    [identities, supportedChains],
  );

  const bnsIdentity = getBnsIdentity(identities);

  if (!bnsIdentity) throw new Error("No BNS identity available.");
  if (!rpcEndpoint) throw new Error("RPC endpoint not set in redux store. This is a bug.");

  React.useEffect(() => {
    let isSubscribed = true;
    async function getFeeAndConfig(
      bnsIdentity: Identity,
      addresses: readonly ChainAddressPairWithName[],
    ): Promise<void> {
      const fee = await getPersonalizedAddressRegistrationFee(bnsIdentity, addresses);
      const config = await getConfig();

      if (isSubscribed) {
        setTransactionFee(fee);
        setSupportedChains(config.supportedChains);
      }
    }
    getFeeAndConfig(bnsIdentity, addressesSorted);

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
            <IovnameAccountUpdate
              setTransactionId={setTransactionId}
              transactionFee={transactionFee}
              rpcEndpoint={rpcEndpoint}
              chainAddresses={addressesSorted}
              bnsIdentity={bnsIdentity}
            />
          )}
          {entity === "name" && (
            <NameAccountUpdate
              setTransactionId={setTransactionId}
              transactionFee={transactionFee}
              rpcEndpoint={rpcEndpoint}
              chainAddresses={addressesSorted}
              bnsIdentity={bnsIdentity}
            />
          )}
        </React.Fragment>
      )}
    </PageMenu>
  );
};

export default AccountUpdate;