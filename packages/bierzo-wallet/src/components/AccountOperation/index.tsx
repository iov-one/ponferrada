import { ChainId, Fee, TransactionId } from "@iov/bcp";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { Paper, Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { FormApi } from "final-form";
import {
  Back,
  BillboardContext,
  Block,
  Button,
  Form,
  FormValues,
  makeStyles,
  ToastContext,
  useForm,
} from "medulas-react-components";
import React from "react";
import { amountToString } from "ui-logic";

import { RpcEndpoint } from "../../communication/rpcEndpoint";
import { submitTransaction } from "../../utils/transaction";
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

interface Props {
  readonly id: string;
  readonly submitCaption: string;
  readonly children: React.ReactNode;
  readonly subSection?: (form: FormApi) => React.FunctionComponent;
  readonly header?: React.ReactNode;
  readonly bnsChainId: ChainId;
  readonly onCancel: () => void;
  readonly getFee: (values: FormValues) => Promise<Fee | undefined>;
  readonly getRequest: (values: FormValues) => Promise<JsonRpcRequest>;
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<TransactionId | null>>;
}

const AccountOperation: React.FunctionComponent<Props> = ({
  id,
  onCancel,
  getFee,
  getRequest,
  children,
  rpcEndpoint,
  setTransactionId,
  subSection,
  submitCaption,
  header,
}): JSX.Element => {
  const [transferFee, setTransferFee] = React.useState<Fee | undefined>();
  const messagePaperClasses = useMessagePaper();
  const theme = useTheme<Theme>();
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

  const getSubmitButtonCaption = (fee: Fee | undefined): string => {
    if (fee && fee.tokens) {
      return `${submitCaption} for ${amountToString(fee.tokens)}`;
    }

    return submitCaption;
  };

  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;

    const request = await getRequest(formValues);
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

  const { form, handleSubmit, invalid, submitting, values } = useForm({
    onSubmit,
  });

  const SubSection = React.useMemo(() => {
    if (subSection) {
      return subSection(form);
    }

    return undefined;
  }, [subSection, form]);

  React.useEffect(() => {
    let isSubscribed = true;

    async function setFee(): Promise<void> {
      const fee = await getFee(values as FormValues);
      if (isSubscribed) {
        setTransferFee(fee);
      }
    }

    if (!invalid) {
      setFee();
    } else {
      setTransferFee(undefined);
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
            {header}
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
          {SubSection && <SubSection />}

          <Block
            marginTop={4}
            marginBottom={1}
            justifyContent="center"
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Block width="75%">
              <Button fullWidth type="submit" disabled={invalid || submitting}>
                {getSubmitButtonCaption(transferFee)}
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

export default AccountOperation;
