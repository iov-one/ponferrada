import { ChainId, Fee, Identity, TransactionId } from "@iov/bcp";
import { BnsConnection } from "@iov/bns";
import { FieldValidator } from "final-form";
import {
  BillboardContext,
  FieldInputValue,
  FormValues,
  ToastContext,
  ToastVariant,
} from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import {
  generateRegisterUsernameTxRequest,
  generateRegisterUsernameTxWithFee,
} from "../../communication/requestgenerators";
import AccountEdit, {
  EDIT_ACCOUNT_FIELD,
  getChainAddressPairsFromValues,
} from "../../components/AccountEdit";
import { BwUsernameWithChainName } from "../../components/AccountManage";
import { ChainAddressPairWithName } from "../../components/AddressesTable";
import LedgerBillboardMessage from "../../components/BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "../../components/BillboardMessage/NeumaBillboardMessage";
import PageMenu from "../../components/PageMenu";
import { getConfig, SupportedChain } from "../../config";
import { isValidIov } from "../../logic/account";
import { getConnectionForChainId } from "../../logic/connection";
import { ExtendedIdentity } from "../../store/identities";
import { RootState } from "../../store/reducers";
import { getChainAddressPairWithNamesSorted } from "../../utils/tokens";
import { IOVNAME_MANAGE_ROUTE, TRANSACTIONS_ROUTE } from "../paths";
import ConfirmRegistration from "./components/ConfirmUpdate";

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

const Register = (): JSX.Element => {
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
  const account: BwUsernameWithChainName | undefined = history.location.state;

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

  const onReturnToManage = (): void => {
    history.push(IOVNAME_MANAGE_ROUTE, account);
  };

  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

  const iovnameValidator: FieldValidator<FieldInputValue> = (value): string | undefined => {
    if (!account) {
      if (!value) {
        return "Required";
      }

      const checkResult = isValidIov(value);

      switch (checkResult) {
        case "not_iov":
          return "Iovname must end with *iov";
        case "wrong_number_of_asterisks":
          return "Iovname must include only one namespace";
        case "too_short":
          return "Iovname should be at least 3 characters";
        case "too_long":
          return "Iovname should be maximum 64 characters";
        case "wrong_chars":
          return "Iovname should contain 'abcdefghijklmnopqrstuvwxyz0123456789-_.' characters only";
        case "valid":
          break;
        default:
          throw new Error(`"Unknown iovname validation error: ${checkResult}`);
      }
    }

    return undefined;
  };

  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;

    const addressesToRegister = getChainAddressPairsFromValues(formValues, addressesSorted);

    try {
      const request = await generateRegisterUsernameTxRequest(
        bnsIdentity,
        formValues[EDIT_ACCOUNT_FIELD],
        addressesToRegister,
      );

      if (rpcEndpoint.type === "extension") {
        billboard.show(
          <NeumaBillboardMessage text={rpcEndpoint.authorizeSignAndPostMessage} />,
          "start",
          "flex-end",
          0,
        );
      } else {
        billboard.show(
          <LedgerBillboardMessage text={rpcEndpoint.authorizeSignAndPostMessage} />,
          "center",
          "center",
          0,
        );
      }
      const transactionId = await rpcEndpoint.sendSignAndPostRequest(request);
      if (transactionId === undefined) {
        toast.show(rpcEndpoint.notAvailableMessage, ToastVariant.ERROR);
      } else if (transactionId === null) {
        toast.show("Request rejected", ToastVariant.ERROR);
      } else {
        setTransactionId(transactionId);
      }
    } catch (error) {
      console.error(error);
      toast.show("An error occurred", ToastVariant.ERROR);
    } finally {
      billboard.close();
    }
  };

  return (
    <PageMenu>
      {transactionId ? (
        <ConfirmRegistration transactionId={transactionId} onSeeTrasactions={onSeeTrasactions} />
      ) : (
        <AccountEdit
          accountValidator={iovnameValidator}
          chainAddresses={addressesSorted}
          account={account}
          onCancel={onReturnToManage}
          transactionFee={transactionFee}
          onSubmit={onSubmit}
        />
      )}
    </PageMenu>
  );
};

export default Register;
