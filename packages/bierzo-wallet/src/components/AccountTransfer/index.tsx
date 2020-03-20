import { Address, ChainId, Fee, TransactionId } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { Paper, Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { FieldValidator } from "final-form";
import {
  Back,
  BillboardContext,
  Block,
  Button,
  composeValidators,
  FieldInputValue,
  Form,
  FormValues,
  makeStyles,
  required,
  TextField,
  ToastContext,
  Typography,
  useForm,
} from "medulas-react-components";
import React from "react";
import { amountToString } from "ui-logic";

import { RpcEndpoint } from "../../communication/rpcEndpoint";
import { isValidName, lookupRecipientAddressByName } from "../../logic/account";
import { getConnectionForBns } from "../../logic/connection";
import { submitTransaction } from "../../utils/transaction";
import { AccountModuleMixedType, isAccountData } from "../AccountManage";
import LedgerBillboardMessage from "../BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "../BillboardMessage/NeumaBillboardMessage";

export const RECEPIENT_ADDRESS = "account-recepient-address";

const useMessagePaper = makeStyles({
  rounded: {
    borderRadius: "5px",
    border: "1px solid #F3F3F3",
  },
  elevation1: {
    boxShadow: "none",
  },
});

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

function getTransferButtonCaption(fee: Fee | undefined): string {
  if (fee && fee.tokens) {
    return `Transfer for ${amountToString(fee.tokens)}`;
  }

  return "Transfer";
}

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

const validator = composeValidators(required, recipientValidator);

interface Props {
  readonly id: string;
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
  id,
  onCancel,
  getFee,
  getRequest,
  bnsChainId,
  children,
  rpcEndpoint,
  setTransactionId,
  transferPrompt,
}: Props): JSX.Element => {
  const [transferFee, setTransferFee] = React.useState<Fee | undefined>();
  const messagePaperClasses = useMessagePaper();
  const promptPaperClasses = usePromptPaper();
  const theme = useTheme<Theme>();
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;

    let newOwner: Address = formValues[RECEPIENT_ADDRESS] as Address;
    if (isValidName(newOwner) === "valid") {
      const lookupResult = await lookupRecipientAddressByName(newOwner, bnsChainId);
      newOwner = lookupResult as Address;
    }

    const request = await getRequest(newOwner);
    await submitTransaction(
      request,
      billboard,
      toast,
      rpcEndpoint,
      <NeumaBillboardMessage text={rpcEndpoint.authorizeSignAndPostMessage} />,
      <LedgerBillboardMessage text={rpcEndpoint.authorizeSignAndPostMessage} />,
      (transactionId: TransactionId) => setTransactionId(transactionId),
    );
  };

  const { form, handleSubmit, invalid, pristine, submitting, values } = useForm({
    onSubmit,
  });

  React.useEffect(() => {
    let isSubscribed = true;

    async function setFee(): Promise<void> {
      const fee = await getFee(values[RECEPIENT_ADDRESS] as Address);
      if (isSubscribed) {
        setTransferFee(fee);
      }
    }

    if (!invalid && values[RECEPIENT_ADDRESS]) {
      setFee();
    }

    return () => {
      isSubscribed = false;
    };
  }, [getFee, invalid, values]);

  return (
    <Block
      id={id}
      marginTop={5}
      display="flex"
      flexDirection="column"
      alignContent="center"
      alignItems="center"
      bgcolor={theme.palette.background.default}
    >
      <Block width={650}>
        <Paper classes={messagePaperClasses}>
          <Block padding={5}>
            <Typography color="default" variant="h5" inline>
              You are transferring{" "}
            </Typography>
            <Typography color="primary" variant="h5" inline>
              {isAccountData(account) ? `${account.name}*${account.domain}` : account.username}
            </Typography>
            <Typography color="default" variant="h5" inline>
              {" "}
              from your domain
            </Typography>
            <Block
              marginTop={3}
              padding={3}
              bgcolor={theme.palette.background.default}
              borderLeft="4px solid rgba(255, 189, 2, .5)"
            >
              {children}
            </Block>
          </Block>
        </Paper>

        <Block marginTop={3} />

        <Form onSubmit={handleSubmit}>
          <Paper classes={promptPaperClasses}>
            <Block padding={5}>
              <Typography color="default" variant="h5">
                Who will you be transferring it to?
              </Typography>
              <Block marginTop={3} />
              {transferPrompt}

              <Block marginTop={1} />
              <TextField
                name={RECEPIENT_ADDRESS}
                form={form}
                validate={validator}
                placeholder="Enter blockchain address or iovname"
                fullWidth
                margin="none"
              />
            </Block>
          </Paper>

          <Block
            marginTop={4}
            marginBottom={1}
            justifyContent="center"
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Block width="75%">
              <Button fullWidth type="submit" disabled={invalid || pristine || submitting}>
                {getTransferButtonCaption(transferFee)}
              </Button>
              <Back fullWidth disabled={submitting} onClick={onCancel}>
                Cancel
              </Back>
            </Block>
          </Block>
        </Form>
      </Block>
    </Block>
  );
};

export default AccountTransfer;
