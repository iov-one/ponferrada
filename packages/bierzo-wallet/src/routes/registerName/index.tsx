import { Address, ChainId, Fee, Identity, TransactionId } from "@iov/bcp";
import { BnsConnection } from "@iov/bns";
import { JsonRpcRequest } from "@iov/jsonrpc";
import {
  BillboardContext,
  FormValues,
  ToastContext,
  ToastVariant,
  ValidationError,
} from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";

import { history } from "..";
import {
  generateRegisterUsernameTxRequest,
  generateRegisterUsernameTxWithFee,
  generateUpdateUsernameTxRequest,
} from "../../communication/requestgenerators";
import { ChainAddressPairWithName } from "../../components/AddressesTable";
import LedgerBillboardMessage from "../../components/BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "../../components/BillboardMessage/NeumaBillboardMessage";
import PageMenu from "../../components/PageMenu";
import { getConfig, SupportedChain } from "../../config";
import { isValidIov } from "../../logic/account";
import { getCodecForChainId } from "../../logic/codec";
import { getConnectionForBns, getConnectionForChainId } from "../../logic/connection";
import { ExtendedIdentity } from "../../store/identities";
import { RootState } from "../../store/reducers";
import { getChainAddressPairWithNamesSorted } from "../../utils/tokens";
import { BwUsernameWithChainName } from "../addresses";
import { ADDRESSES_ROUTE, BALANCE_ROUTE, TRANSACTIONS_ROUTE } from "../paths";
import Layout, { REGISTER_USERNAME_FIELD } from "./components";
import ConfirmRegistration from "./components/ConfirmRegistration";
import { addressValueField, blockchainValueField } from "./components/SelectAddressesTable";

function onSeeTrasactions(): void {
  history.push(TRANSACTIONS_ROUTE);
}
function onReturnToBalance(): void {
  history.push(BALANCE_ROUTE);
}
function onReturnToAddresses(): void {
  history.push(ADDRESSES_ROUTE);
}

function getBnsIdentity(identities: ReadonlyMap<ChainId, ExtendedIdentity>): Identity | undefined {
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

function getChainAddressPairsFromValues(
  values: FormValues,
  addresses: readonly ChainAddressPairWithName[],
): readonly ChainAddressPairWithName[] {
  const chainAddressMap: Map<string, Partial<ChainAddressPairWithName>> = new Map<
    string,
    Partial<ChainAddressPairWithName>
  >();
  console.log("getChainAddressPairsFromValues: 1");
  Object.keys(values).forEach(key => {
    const idxLenght = key.indexOf("-");
    if (idxLenght === -1) return;

    const index = key.substr(0, idxLenght);
    let pair = chainAddressMap.get(index);
    if (!pair) {
      pair = {};
    }

    const type = key.substr(idxLenght + 1);
    switch (type) {
      case addressValueField: {
        pair = { ...pair, address: values[key] as Address };
        break;
      }
      case blockchainValueField: {
        const chain = addresses.find(address => address.chainName === values[key]);
        if (chain) {
          pair = { ...pair, chainId: chain.chainId, chainName: chain.chainName };
        }
        break;
      }
    }

    chainAddressMap.set(index, pair);
  });

  console.log("getChainAddressPairsFromValues: 2");

  const chainAddressPair: ChainAddressPairWithName[] = [];
  chainAddressMap.forEach(value => {
    if (value.address && value.chainId && value.chainName) {
      chainAddressPair.push({
        address: value.address,
        chainId: value.chainId,
        chainName: value.chainName,
      });
    }
  });

  console.log("getChainAddressPairsFromValues: 3");

  return chainAddressPair;
}

const RegisterUsername = (): JSX.Element => {
  const [transactionId, setTransactionId] = React.useState<TransactionId | null>(null);
  const [transactionFee, setTransactionFee] = React.useState<Fee | undefined>(undefined);
  const [supportedChains, setSupportedChains] = React.useState<readonly SupportedChain[]>([]);

  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

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

  const validate = async (values: object): Promise<object> => {
    const formValues = values as FormValues;
    const errors: ValidationError = {};
    console.log("validate: ", formValues);
    if (!iovnameAddresses) {
      const username = formValues[REGISTER_USERNAME_FIELD];
      if (!username) {
        errors[REGISTER_USERNAME_FIELD] = "Required";
        return errors;
      }

      const checkResult = isValidIov(username);

      switch (checkResult) {
        case "not_iov":
          errors[REGISTER_USERNAME_FIELD] = "IOV starname must include *iov";
          break;
        case "wrong_number_of_asterisks":
          errors[REGISTER_USERNAME_FIELD] = "IOV starname must include only one namespace";
          break;
        case "too_short":
          errors[REGISTER_USERNAME_FIELD] = "IOV starname should be at least 3 characters";
          break;
        case "too_long":
          errors[REGISTER_USERNAME_FIELD] = "IOV starname should be maximum 64 characters";
          break;
        case "wrong_chars":
          errors[REGISTER_USERNAME_FIELD] =
            "IOV starname should contain 'abcdefghijklmnopqrstuvwxyz0123456789-_.' characters only";
          break;
        case "valid":
          break;
        default:
          throw new Error(`"Unknown IOV starname validation error: ${checkResult}`);
      }

      if (checkResult !== "valid") {
        return errors;
      }

      const connection = await getConnectionForBns();
      const usernames = await connection.getUsernames({ username });
      if (usernames.length > 0) {
        errors[REGISTER_USERNAME_FIELD] = "Personalized address already exists";
        return errors;
      }
    }

    const addressesToRegister = getChainAddressPairsFromValues(formValues, addressesSorted);
    for (const address of addressesToRegister) {
      const codec = await getCodecForChainId(address.chainId);
      if (!codec.isValidAddress(address.address)) {
        const addressField = Object.entries(formValues).find(([_id, value]) => {
          if (value === address.address) return true;
          return false;
        });
        if (addressField) {
          errors[addressField[0]] = "Not valid blockchain address";
        }
      }
    }

    return errors;
  };

  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;

    console.log("onSubmit: ", onSubmit);
    const addressesToRegister = getChainAddressPairsFromValues(formValues, addressesSorted);
    console.log("addressesToRegister: ", addressesToRegister);

    try {
      let request: JsonRpcRequest;
      if (iovnameAddresses) {
        request = await generateUpdateUsernameTxRequest(
          bnsIdentity,
          iovnameAddresses.username,
          addressesToRegister,
        );
      } else {
        request = await generateRegisterUsernameTxRequest(
          bnsIdentity,
          formValues[REGISTER_USERNAME_FIELD],
          addressesToRegister,
        );
      }
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
        <Layout
          onSubmit={onSubmit}
          validate={validate}
          onCancel={iovnameAddresses ? onReturnToAddresses : onReturnToBalance}
          chainAddresses={addressesSorted}
          iovnameAddresses={iovnameAddresses}
          transactionFee={transactionFee}
        />
      )}
    </PageMenu>
  );
};

export default RegisterUsername;
