import { ChainId, Fee, Identity, TransactionId } from "@iov/bcp";
import { BnsConnection } from "@iov/bns";
import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "../..";
import { generateRegisterUsernameTxWithFee } from "../../../communication/requestgenerators";
import { BwUsernameWithChainName } from "../../../components/AccountManage";
import { ChainAddressPairWithName } from "../../../components/AddressesTable";
import PageMenu from "../../../components/PageMenu";
import { getConfig, SupportedChain } from "../../../config";
import { getConnectionForChainId } from "../../../logic/connection";
import { ExtendedIdentity } from "../../../store/identities";
import { RootState } from "../../../store/reducers";
import { getChainAddressPairWithNamesSorted } from "../../../utils/tokens";
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

export type AccountEntity = "iovname" | "starname" | "name";

export interface AccountProps {
  entity: AccountEntity;
}

const Register = ({ entity }: AccountProps): JSX.Element => {
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
  const iovnameAddresses: BwUsernameWithChainName | undefined = history.location.state;

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
            <IovnameForm
              onCancel={iovnameAddresses ? onReturnToAddresses : onReturnToBalance}
              chainAddresses={addressesSorted}
              iovnameAddresses={iovnameAddresses}
              bnsIdentity={bnsIdentity}
              rpcEndpoint={rpcEndpoint}
              transactionFee={transactionFee}
              setTransactionId={setTransactionId}
            />
          )}
          {entity === "starname" && (
            <StarnameForm
              onCancel={iovnameAddresses ? onReturnToAddresses : onReturnToBalance}
              iovnameAddresses={iovnameAddresses}
              bnsIdentity={bnsIdentity}
              rpcEndpoint={rpcEndpoint}
              transactionFee={transactionFee}
              setTransactionId={setTransactionId}
            />
          )}
          {entity === "name" && (
            <NameForm
              onCancel={iovnameAddresses ? onReturnToAddresses : onReturnToBalance}
              chainAddresses={addressesSorted}
              iovnameAddresses={iovnameAddresses}
              bnsIdentity={bnsIdentity}
              rpcEndpoint={rpcEndpoint}
              transactionFee={transactionFee}
              setTransactionId={setTransactionId}
            />
          )}
        </React.Fragment>
      )}
    </PageMenu>
  );
};

export default Register;
