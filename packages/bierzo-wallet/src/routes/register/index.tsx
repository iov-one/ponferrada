import { Address, ChainId, Fee, Identity, TransactionId } from "@iov/bcp";
import { BnsConnection } from "@iov/bns";
import { Avatar, Block, FormValues, Image, makeStyles, Typography } from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";
import { amountToString } from "ui-logic";

import { history } from "..";
import { generateRegisterUsernameTxWithFee } from "../../communication/requestgenerators";
import { ChainAddressPairWithName } from "../../components/AddressesTable";
import PageMenu from "../../components/PageMenu";
import { getConnectionForChainId } from "../../logic/connection";
import { ExtendedIdentity } from "../../store/identities";
import { RootState } from "../../store/reducers";
import { getChainAddressPairWithNamesSorted } from "../../utils/tokens";
import { BwUsernameWithChainName } from "../addresses";
import { ADDRESSES_ROUTE, BALANCE_ROUTE, TRANSACTIONS_ROUTE } from "../paths";
import shield from "./assets/shield.svg";
import ConfirmRegistration from "./components/ConfirmRegistration";
import IovnameForm from "./components/IovnameForm";
import NameForm from "./components/NameForm";
import {
  addressValueField,
  blockchainValueField,
  getAddressInputName,
  getBlockchainInputName,
  SelectAddressItem,
} from "./components/SelectAddressesTable";
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

const registerTooltipIcon = <Image src={shield} alt="shield" width={24} height={24} />;

const useStyles = makeStyles({
  addressesHeader: {
    backgroundColor: "#31E6C9",
    fontSize: "27.5px",
    width: 56,
    height: 56,
  },
});

export function AddressesTooltipHeader(): JSX.Element {
  const classes = useStyles();
  const avatarClasses = { root: classes.addressesHeader };
  return <Avatar classes={avatarClasses}>{registerTooltipIcon}</Avatar>;
}

interface TooltipContentProps {
  readonly header: React.ReactNode;
  readonly title: string;
  readonly children: React.ReactNode;
}

export function TooltipContent({ children, title, header }: TooltipContentProps): JSX.Element {
  return (
    <Block padding={2} display="flex" flexDirection="column" alignItems="center">
      {header}
      <Block marginTop={2} />
      <Typography variant="subtitle1" weight="semibold" align="center" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="textPrimary" align="center">
        {children}
      </Typography>
    </Block>
  );
}

export function getSubmitButtonCaption(fee: Fee | undefined): string {
  if (fee && fee.tokens) {
    return `Register for ${amountToString(fee.tokens)}`;
  }

  return "Register";
}

export function getFormInitValues(addressItems: SelectAddressItem[]): FormValues {
  const initialValues: FormValues = {};
  addressItems.forEach(item => {
    initialValues[getAddressInputName(item.id)] = item.chain.address;
    initialValues[getBlockchainInputName(item.id)] = item.chain.chainName;
  });

  return initialValues;
}

export function getAddressItems(chainAddresses: readonly ChainAddressPairWithName[]): SelectAddressItem[] {
  const addressItems: SelectAddressItem[] = [];
  chainAddresses.forEach((chain, index) => {
    addressItems.push({
      id: index.toString(),
      chain,
    });
  });

  return addressItems;
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

export function getChainAddressPairsFromValues(
  values: FormValues,
  addresses: readonly ChainAddressPairWithName[],
): readonly ChainAddressPairWithName[] {
  const chainAddressMap: Map<string, Partial<ChainAddressPairWithName>> = new Map<
    string,
    Partial<ChainAddressPairWithName>
  >();
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

  return chainAddressPair;
}

export enum ToRegister {
  Iovname = "iovname",
  Starname = "starname",
  Name = "name",
}

interface Props {
  entity: ToRegister;
}

const Register = ({ entity }: Props): JSX.Element => {
  const [transactionId, setTransactionId] = React.useState<TransactionId | null>(null);
  const [transactionFee, setTransactionFee] = React.useState<Fee | undefined>(undefined);

  const rpcEndpoint = ReactRedux.useSelector((state: RootState) => state.rpcEndpoint);
  const identities = ReactRedux.useSelector((state: RootState) => state.identities);
  const addressesSorted = React.useMemo(() => getChainAddressPairWithNamesSorted(identities), [identities]);

  const bnsIdentity = getBnsIdentity(identities);
  const iovnameAddresses: BwUsernameWithChainName | undefined = history.location.state;

  if (!bnsIdentity) throw new Error("No BNS identity available.");
  if (!rpcEndpoint) throw new Error("RPC endpoint not set in redux store. This is a bug.");

  React.useEffect(() => {
    let isSubscribed = true;
    async function getFee(
      bnsIdentity: Identity,
      addresses: readonly ChainAddressPairWithName[],
    ): Promise<void> {
      const fee = await getPersonalizedAddressRegistrationFee(bnsIdentity, addresses);

      if (isSubscribed) {
        setTransactionFee(fee);
      }
    }
    getFee(bnsIdentity, addressesSorted);

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
          {entity === ToRegister.Iovname && (
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
          {entity === ToRegister.Starname && (
            <StarnameForm
              onCancel={iovnameAddresses ? onReturnToAddresses : onReturnToBalance}
              iovnameAddresses={iovnameAddresses}
              bnsIdentity={bnsIdentity}
              rpcEndpoint={rpcEndpoint}
              transactionFee={transactionFee}
              setTransactionId={setTransactionId}
            />
          )}
          {entity === ToRegister.Name && (
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
