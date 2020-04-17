import { Fee, Identity, TransactionId } from "@iov/bcp";
import { FieldValidator } from "final-form";
import {
  Back,
  BillboardContext,
  Block,
  Button,
  FieldInputValue,
  Form,
  FormValues,
  Image,
  makeStyles,
  TextField,
  ToastContext,
  ToastVariant,
  Tooltip,
  Typography,
  useForm,
} from "medulas-react-components";
import React from "react";
import { ErrorParser } from "ui-logic";

import {
  generateRegisterDomainTxRequest,
  generateRegisterDomainTxWithFee,
} from "../../../../communication/requestgenerators";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import { getSubmitButtonCaption } from "../../../../components/AccountEdit";
import { TooltipContent } from "../../../../components/AccountManage";
import LedgerBillboardMessage from "../../../../components/BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "../../../../components/BillboardMessage/NeumaBillboardMessage";
import PageContent from "../../../../components/PageContent";
import { isValidStarname } from "../../../../logic/account";
import shield from "../assets/shield.svg";

export const REGISTER_STARNAME_VIEW_ID = "register-starname-view-id";
export const REGISTER_STARNAME_FIELD = "register-starname-field";

const registerIcon = <Image src={shield} alt="shield" />;

const useStyles = makeStyles({
  starnameHeader: {
    boxShadow: "0px 0px 14px #EDEFF4",
  },
});

export function NoStarnameHeader(): JSX.Element {
  const classes = useStyles();
  return (
    <Block className={classes.starnameHeader} borderRadius={40} width={145} padding={1}>
      <Typography variant="subtitle1" weight="semibold" color="primary" align="center">
        *yourstarname
      </Typography>
    </Block>
  );
}

interface Props {
  readonly onCancel: () => void;
  readonly bnsIdentity: Identity;
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<TransactionId | null>>;
}

const StarnameForm = ({ bnsIdentity, rpcEndpoint, onCancel, setTransactionId }: Props): JSX.Element => {
  const [transactionFee, setTransactionFee] = React.useState<Fee | undefined>();
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;
    const domain = formValues[REGISTER_STARNAME_FIELD].split("*")[1];

    try {
      const request = await generateRegisterDomainTxRequest(bnsIdentity, domain);
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
      const message = ErrorParser.tryParseWeaveError(error) || "An unknown error occurred";
      toast.show(message, ToastVariant.ERROR);
    } finally {
      billboard.close();
    }
  };

  const { form, handleSubmit, invalid, submitting, validating, values } = useForm({
    onSubmit,
  });

  React.useEffect(() => {
    let isSubscribed = true;

    async function setFee(): Promise<void> {
      const formValues = values as FormValues;
      if (!formValues[REGISTER_STARNAME_FIELD]) return;

      const domain = formValues[REGISTER_STARNAME_FIELD].split("*")[1];

      const fee = (await generateRegisterDomainTxWithFee(bnsIdentity, domain)).fee;

      if (isSubscribed) {
        setTransactionFee(fee);
      }
    }

    if (!invalid) {
      setFee();
    } else {
      setTransactionFee(undefined);
    }

    return () => {
      isSubscribed = false;
    };
  }, [bnsIdentity, invalid, values]);

  const starnameValidator: FieldValidator<FieldInputValue> = (value): string | undefined => {
    if (!value) {
      return "Required";
    }

    const checkResult = isValidStarname(value);

    switch (checkResult) {
      case "not_starname":
        return "Starname must include namespace after '*'";
      case "wrong_number_of_asterisks":
        return "Starname must include only one namespace";
      case "too_short":
        return "Starname should be at least 3 characters";
      case "too_long":
        return "Starname should be maximum 16 characters";
      case "wrong_chars":
        return "Starname should contain 'abcdefghijklmnopqrstuvwxyz0123456789-_.' characters only";
      case "valid":
        break;
      default:
        throw new Error(`"Unknown starname validation error: ${checkResult}`);
    }

    return undefined;
  };

  /* const validateStarnameExists = React.useCallback((values: object) => {
    const validate = async (values: object): Promise<object> => {
      const formValues = values as FormValues;
      const errors: ValidationError = {};

      const connection = await getConnectionForBns();
      const noAsteriskDomain = value.substring(1);
      const domains = await connection.getDomains({ name: noAsteriskDomain });
      if (domains.length > 0) {
        errors[REGISTER_STARNAME_FIELD] = "Starname already exists";
        return errors;
      }

      return errors;
    };

    validate(values);
  }, []); */

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
      <PageContent id={REGISTER_STARNAME_VIEW_ID} icon={registerIcon} buttons={buttons} avatarColor="#31E6C9">
        <Block width="100%" textAlign="left">
          <Block display="flex" justifyContent="space-between" marginBottom={1}>
            <Typography variant="subtitle2" weight="semibold">
              Register your starname
            </Typography>
            <Block display="flex" alignItems="center">
              <Tooltip maxWidth={320}>
                <TooltipContent header={<NoStarnameHeader />} title="Choose your address">
                  With IOV you can choose your easy to read human readable address. No more complicated
                  cryptography when sending to friends.
                </TooltipContent>
              </Tooltip>
              <Block marginRight={1} />
              <Typography variant="subtitle2" inline weight="regular">
                How it works
              </Typography>
            </Block>
          </Block>
          <Block width="100%" marginBottom={1}>
            <TextField
              name={REGISTER_STARNAME_FIELD}
              form={form}
              validate={starnameValidator}
              placeholder="eg. *starname"
              fullWidth
              margin="none"
            />
          </Block>
        </Block>
      </PageContent>
    </Form>
  );
};

export default StarnameForm;
