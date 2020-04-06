import { Address, ChainId, Fee, TransactionId } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { Paper } from "@material-ui/core";
import { FieldValidator, FormApi } from "final-form";
import {
  Block,
  composeValidators,
  FieldInputValue,
  FormValues,
  makeStyles,
  required,
  TextField,
  Typography,
} from "medulas-react-components";
import React from "react";

import { RpcEndpoint } from "../../communication/rpcEndpoint";
import { isValidName, lookupRecipientAddressByName } from "../../logic/account";
import { getConnectionForBns } from "../../logic/connection";
import { AccountModuleMixedType, isAccountData } from "../AccountManage";
import AccountOperation from "../AccountOperation";

export const ACCOUNT_TRANSFER_LABEL = "account-transfer-label";
export const ACCOUNT_TRANSFER_RECIPIENT = "account-transfer-recipient";

const usePromptPaper = makeStyles({
  rounded: {
    borderRadius: "5px",
    boxShadow: "0px 6px 16px rgba(20, 197, 148, 0.15)",
    border: "1px solid #09D69E",
  },
  elevation1: {
    boxShadow: "none",
  },
});

const recipientValidator: FieldValidator<FieldInputValue> = async (value): Promise<string | undefined> => {
  if (typeof value !== "string") throw new Error("Input must be a string");

  const nameValidity = isValidName(value);

  if (nameValidity !== "valid" && !bnsCodec.isValidAddress(value)) {
    return "Must be an IOV human readable address or a native IOV address";
  }

  if (nameValidity !== "valid" && bnsCodec.isValidAddress(value)) {
    return undefined;
  }

  const connection = await getConnectionForBns();
  const lookupResult = await lookupRecipientAddressByName(value, connection.chainId);

  if (lookupResult === "name_not_found") {
    return "Recipient's account was not found";
  } else if (lookupResult === "no_address_for_blockchain") {
    return "Recipient's account does not contain an address for this blockchain";
  }

  return undefined;
};

interface HeaderProps {
  readonly account: AccountModuleMixedType;
}

const Header: React.FunctionComponent<HeaderProps> = ({ account }): JSX.Element => (
  <React.Fragment>
    <Typography color="default" variant="h5" inline>
      You are transferring{" "}
    </Typography>
    <Typography color="primary" variant="h5" inline data-test={ACCOUNT_TRANSFER_LABEL}>
      {isAccountData(account) ? `${account.name}*${account.domain}` : account.username}
    </Typography>
    <Typography color="default" variant="h5" inline>
      {" "}
      from your domain
    </Typography>
  </React.Fragment>
);

const validator = composeValidators(required, recipientValidator);

interface Props {
  readonly account: AccountModuleMixedType;
  readonly children: React.ReactNode;
  readonly transferPrompt: React.ReactNode;
  readonly bnsChainId: ChainId;
  readonly onCancel: () => void;
  readonly getFee: (newOwner: Address) => Promise<Fee | undefined>;
  readonly getRequest: (newOwner: Address) => Promise<JsonRpcRequest>;
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<TransactionId | null>>;
}

const AccountTransfer = ({
  account,
  onCancel,
  getFee,
  getRequest,
  bnsChainId,
  children,
  rpcEndpoint,
  setTransactionId,
  transferPrompt,
}: Props): JSX.Element => {
  const promptPaperClasses = usePromptPaper();

  const subSection = (form: FormApi): React.FunctionComponent => (): JSX.Element => {
    return (
      <Paper classes={promptPaperClasses}>
        <Block padding={5}>
          <Typography color="default" variant="h5">
            Who will you be transferring it to?
          </Typography>
          <Block marginTop={3} />
          {transferPrompt}

          <Block marginTop={1} />
          <TextField
            name={ACCOUNT_TRANSFER_RECIPIENT}
            form={form}
            validate={validator}
            placeholder="Enter blockchain address or iovname"
            fullWidth
            margin="none"
            data-test={ACCOUNT_TRANSFER_RECIPIENT}
          />
        </Block>
      </Paper>
    );
  };

  const getNewOwnerAddress = async (newOwner: string): Promise<Address> => {
    if (isValidName(newOwner) === "valid") {
      const lookupResult = await lookupRecipientAddressByName(newOwner, bnsChainId);
      return lookupResult as Address;
    }

    return newOwner as Address;
  };

  const getTransferRequest = async (values: FormValues): Promise<JsonRpcRequest> => {
    const newOwner = await getNewOwnerAddress(values[ACCOUNT_TRANSFER_RECIPIENT]);

    return await getRequest(newOwner);
  };

  const getTransferFee = async (values: FormValues): Promise<Fee | undefined> => {
    if (!values[ACCOUNT_TRANSFER_RECIPIENT]) return undefined;

    const newOwner = await getNewOwnerAddress(values[ACCOUNT_TRANSFER_RECIPIENT]);

    return await getFee(newOwner);
  };

  return (
    <AccountOperation
      submitCaption="Transfer"
      onCancel={onCancel}
      getFee={getTransferFee}
      getRequest={getTransferRequest}
      bnsChainId={bnsChainId}
      rpcEndpoint={rpcEndpoint}
      setTransactionId={setTransactionId}
      header={<Header account={account} />}
      subSection={subSection}
    >
      {children}
    </AccountOperation>
  );
};

export default AccountTransfer;
