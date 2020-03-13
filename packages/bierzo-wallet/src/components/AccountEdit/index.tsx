import { Address, Fee } from "@iov/bcp";
import clipboardCopy from "clipboard-copy";
import {
  Back,
  Block,
  Button,
  Form,
  FormValues,
  Hairline,
  Image,
  makeStyles,
  ToastContext,
  ToastVariant,
  Tooltip,
  Typography,
  useForm,
} from "medulas-react-components";
import React from "react";
import { amountToString } from "ui-logic";

import { formatDate, formatTime } from "../../utils/date";
import {
  AddressesTooltipHeader,
  BwAccountWithChainName,
  BwUsernameWithChainName,
  isAccountData,
  TooltipContent,
} from "../AccountManage";
import { AddressesTableProps, ChainAddressPairWithName } from "../AddressesTable";
import copy from "../AddressesTable/assets/copy.svg";
import PageContent from "../PageContent";
import shield from "./assets/shield.svg";
import SelectAddressesTable, {
  addressValueField,
  blockchainValueField,
  getAddressInputName,
  getBlockchainInputName,
  SelectAddressItem,
} from "./SelectAddressesTable";

export const EDIT_ACCOUNT_VIEW_ID = "edit-account-view-id";
export const EDIT_ACCOUNT_FIELD = "edit-account-field";

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
    if (chain.address) {
      addressItems.push({
        id: index.toString(),
        chain,
      });
    }
  });

  return addressItems;
}

const registerIcon = <Image src={shield} alt="shield" />;

const useStyles = makeStyles({
  iovnameHeader: {
    boxShadow: "0px 0px 14px #EDEFF4",
  },
  link: {
    cursor: "pointer",
  },
});

export function NoIovnameHeader(): JSX.Element {
  const classes = useStyles();
  return (
    <Block className={classes.iovnameHeader} borderRadius={40} width={145} padding={1}>
      <Typography variant="subtitle1" weight="semibold" color="primary" align="center">
        yourname*iov
      </Typography>
    </Block>
  );
}

export interface AccountEditProps extends AddressesTableProps {
  readonly onCancel: () => void;
  readonly account: BwUsernameWithChainName | BwAccountWithChainName;
  readonly transactionFee: Fee | undefined;
}

interface Props extends AccountEditProps {
  readonly onSubmit: (values: object) => Promise<void>;
}

const AccountEdit = ({ chainAddresses, account, onCancel, transactionFee, onSubmit }: Props): JSX.Element => {
  const classes = useStyles();
  const toast = React.useContext(ToastContext);

  const chainAddressesItems = React.useMemo(() => {
    return getAddressItems(account.addresses);
  }, [account]);

  const initialValues = React.useMemo(() => getFormInitValues(chainAddressesItems), [chainAddressesItems]);
  const { form, handleSubmit, invalid, submitting, validating } = useForm({
    onSubmit,
    initialValues,
  });

  const onAccountCopy = (): void => {
    if (account) {
      const name = isAccountData(account) ? account.name : account.username;
      clipboardCopy(name);
      toast.show("Account has been copied to clipboard.", ToastVariant.INFO);
    }
  };

  const buttons = (
    <Block
      marginTop={4}
      marginBottom={1}
      justifyContent="center"
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      <Block width="75%">
        <Button
          fullWidth
          type="submit"
          disabled={invalid || submitting || validating}
          spinner={submitting || validating}
        >
          {getSubmitButtonCaption(transactionFee)}
        </Button>
      </Block>
      <Block width="75%" marginTop={1}>
        <Back fullWidth disabled={submitting} onClick={onCancel}>
          Cancel
        </Back>
      </Block>
    </Block>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <PageContent id={EDIT_ACCOUNT_VIEW_ID} icon={registerIcon} buttons={buttons} avatarColor="#31E6C9">
        <Block textAlign="left">
          <Block display="flex" justifyContent="center">
            <Typography variant="h4" align="center">
              {isAccountData(account) ? `${account.name}*${account.domain}` : account.username}
            </Typography>
            <Block marginRight={2} />
            <Block onClick={onAccountCopy} className={classes.link} marginTop={1}>
              <Image src={copy} alt="Copy" width={20} />
            </Block>
          </Block>
          {isAccountData(account) && (
            <Block display="flex" justifyContent="center">
              <Typography variant="body2" inline align="center" color="textSecondary">
                Expires on {formatDate(account.expiryDate)} {formatTime(account.expiryDate)}
              </Typography>
            </Block>
          )}

          <Block width="100%" marginTop={3} marginBottom={1}>
            <Block display="flex" alignItems="center" marginBottom={1}>
              <Block width={440}>
                <Typography variant="body2" weight="semibold" inline>
                  CHOOSE LINKED ADDRESSES
                </Typography>
              </Block>
              <Block marginRight={1} />
              <Block width={34}>
                <Tooltip maxWidth={320}>
                  <TooltipContent header={<AddressesTooltipHeader />} title="Your linked addresses">
                    With Neuma you can have an universal blockchain address that is linked to all your
                    addresses. Just give your friends your iovname.
                  </TooltipContent>
                </Tooltip>
              </Block>
              <Block width="100%" marginLeft={1} marginRight={1}>
                <Hairline />
              </Block>
              <Typography variant="subtitle2" inline weight="regular">
                Optional
              </Typography>
            </Block>
            <SelectAddressesTable
              availableBlockchains={chainAddresses}
              chainAddressesItems={chainAddressesItems}
              form={form}
            />
          </Block>
        </Block>
      </PageContent>
    </Form>
  );
};

export default AccountEdit;
