import { Fee, Identity, TransactionId } from "@iov/bcp";
import {
  Back,
  BillboardContext,
  Block,
  Button,
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
  ValidationError,
} from "medulas-react-components";
import React from "react";

import { getSubmitButtonCaption, TooltipContent } from "..";
import { generateRegisterDomainTxRequest } from "../../../communication/requestgenerators";
import { RpcEndpoint } from "../../../communication/rpcEndpoint";
import LedgerBillboardMessage from "../../../components/BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "../../../components/BillboardMessage/NeumaBillboardMessage";
import PageContent from "../../../components/PageContent";
import { isValidStarname } from "../../../logic/account";
import { getConnectionForBns } from "../../../logic/connection";
import { BwUsernameWithChainName } from "../../addresses";
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
  readonly iovnameAddresses: BwUsernameWithChainName | undefined;
  readonly bnsIdentity: Identity;
  readonly rpcEndpoint: RpcEndpoint;
  readonly transactionFee: Fee | undefined;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<TransactionId | null>>;
}

const StarnameForm = ({
  iovnameAddresses,
  bnsIdentity,
  rpcEndpoint,
  onCancel,
  transactionFee,
  setTransactionId,
}: Props): JSX.Element => {
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

  const onSubmitCallback = React.useCallback(
    (values: object) => {
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
          toast.show("An error occurred", ToastVariant.ERROR);
        } finally {
          billboard.close();
        }
      };

      onSubmit(values);
    },
    [billboard, bnsIdentity, rpcEndpoint, setTransactionId, toast],
  );

  const validateCallback = React.useCallback(
    (values: object) => {
      const validate = async (values: object): Promise<object> => {
        const formValues = values as FormValues;
        const errors: ValidationError = {};

        if (!iovnameAddresses) {
          const username = formValues[REGISTER_STARNAME_FIELD];
          if (!username) {
            errors[REGISTER_STARNAME_FIELD] = "Required";
            return errors;
          }

          const checkResult = isValidStarname(username);

          switch (checkResult) {
            case "not_starname":
              errors[REGISTER_STARNAME_FIELD] = "Starname must have format *starname";
              break;
            case "wrong_number_of_asterisks":
              errors[REGISTER_STARNAME_FIELD] = "Starname must include only one namespace";
              break;
            case "too_short":
              errors[REGISTER_STARNAME_FIELD] = "Starname should be at least 3 characters";
              break;
            case "too_long":
              errors[REGISTER_STARNAME_FIELD] = "Starname should be maximum 16 characters";
              break;
            case "wrong_chars":
              errors[REGISTER_STARNAME_FIELD] =
                "Starname should contain 'abcdefghijklmnopqrstuvwxyz0123456789-_.' characters only";
              break;
            case "valid":
              break;
            default:
              throw new Error(`"Unknown starname validation error: ${checkResult}`);
          }

          if (checkResult !== "valid") {
            return errors;
          }

          const connection = await getConnectionForBns();
          const usernames = await connection.getUsernames({ username });
          if (usernames.length > 0) {
            errors[REGISTER_STARNAME_FIELD] = "Personalized address already exists";
            return errors;
          }
        }

        return errors;
      };

      validate(values);
    },
    [iovnameAddresses],
  );

  const { form, handleSubmit, invalid, submitting, validating } = useForm({
    onSubmit: onSubmitCallback,
    validate: validateCallback,
  });

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
          {iovnameAddresses && (
            <Typography variant="h4" align="center">
              {iovnameAddresses.username}
            </Typography>
          )}
          {!iovnameAddresses && (
            <React.Fragment>
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
                  placeholder="eg. *starname"
                  fullWidth
                  margin="none"
                />
              </Block>
            </React.Fragment>
          )}
        </Block>
      </PageContent>
    </Form>
  );
};

export default StarnameForm;
