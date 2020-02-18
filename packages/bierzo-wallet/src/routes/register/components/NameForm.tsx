import { Fee, Identity, TransactionId } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { JsonRpcRequest } from "@iov/jsonrpc";
import {
  Back,
  BillboardContext,
  Block,
  Button,
  Form,
  FormValues,
  Hairline,
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

import {
  AddressesTooltipHeader,
  getAddressItems,
  getChainAddressPairsFromValues,
  getFormInitValues,
  getSubmitButtonCaption,
  TooltipContent,
} from "..";
import {
  generateRegisterAccountTxRequest,
  generateReplaceAccountTargetsTxRequest,
} from "../../../communication/requestgenerators";
import { RpcEndpoint } from "../../../communication/rpcEndpoint";
import { AddressesTableProps } from "../../../components/AddressesTable";
import LedgerBillboardMessage from "../../../components/BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "../../../components/BillboardMessage/NeumaBillboardMessage";
import PageContent from "../../../components/PageContent";
import { isValidIov } from "../../../logic/account";
import { getCodecForChainId } from "../../../logic/codec";
import { getConnectionForBns } from "../../../logic/connection";
import { BwUsernameWithChainName } from "../../addresses";
import shield from "../assets/shield.svg";
import SelectAddressesTable from "./SelectAddressesTable";

export const REGISTER_NAME_VIEW_ID = "register-name-view-id";
export const REGISTER_NAME_FIELD = "register-name-field";

const registerIcon = <Image src={shield} alt="shield" />;

const useStyles = makeStyles({
  iovnameHeader: {
    boxShadow: "0px 0px 14px #EDEFF4",
  },
});

function NoNameHeader(): JSX.Element {
  const classes = useStyles();
  return (
    <Block className={classes.iovnameHeader} borderRadius={40} width={145} padding={1}>
      <Typography variant="subtitle1" weight="semibold" color="primary" align="center">
        name*yourstarname
      </Typography>
    </Block>
  );
}

interface Props extends AddressesTableProps {
  readonly onCancel: () => void;
  readonly iovnameAddresses: BwUsernameWithChainName | undefined;
  readonly bnsIdentity: Identity;
  readonly rpcEndpoint: RpcEndpoint;
  readonly transactionFee: Fee | undefined;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<TransactionId | null>>;
}

const NameForm = ({
  chainAddresses,
  iovnameAddresses,
  bnsIdentity,
  rpcEndpoint,
  onCancel,
  transactionFee,
  setTransactionId,
}: Props): JSX.Element => {
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

  const chainAddressesItems = React.useMemo(() => {
    if (iovnameAddresses) {
      return getAddressItems(iovnameAddresses.addresses);
    }
    return getAddressItems(chainAddresses);
  }, [chainAddresses, iovnameAddresses]);

  const onSubmitCallback = React.useCallback(
    (values: object) => {
      const onSubmit = async (values: object): Promise<void> => {
        const formValues = values as FormValues;

        const addressesToRegister = getChainAddressPairsFromValues(formValues, chainAddresses);
        const [name, domain] = formValues[REGISTER_NAME_FIELD].split("*");

        try {
          let request: JsonRpcRequest;
          if (iovnameAddresses) {
            request = await generateReplaceAccountTargetsTxRequest(
              bnsIdentity,
              domain,
              name,
              addressesToRegister,
            );
          } else {
            request = await generateRegisterAccountTxRequest(
              bnsIdentity,
              domain,
              name,
              bnsCodec.identityToAddress(bnsIdentity),
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

      onSubmit(values);
    },
    [billboard, bnsIdentity, chainAddresses, iovnameAddresses, rpcEndpoint, setTransactionId, toast],
  );

  const validateCallback = React.useCallback(
    (values: object) => {
      const validate = async (values: object): Promise<object> => {
        const formValues = values as FormValues;
        const errors: ValidationError = {};

        if (!iovnameAddresses) {
          const username = formValues[REGISTER_NAME_FIELD];
          if (!username) {
            errors[REGISTER_NAME_FIELD] = "Required";
            return errors;
          }

          const checkResult = isValidIov(username);

          switch (checkResult) {
            case "not_iov":
              errors[REGISTER_NAME_FIELD] = "Iovname must include *iov";
              break;
            case "wrong_number_of_asterisks":
              errors[REGISTER_NAME_FIELD] = "Iovname must include only one namespace";
              break;
            case "too_short":
              errors[REGISTER_NAME_FIELD] = "Iovname should be at least 3 characters";
              break;
            case "too_long":
              errors[REGISTER_NAME_FIELD] = "Iovname should be maximum 64 characters";
              break;
            case "wrong_chars":
              errors[REGISTER_NAME_FIELD] =
                "Iovname should contain 'abcdefghijklmnopqrstuvwxyz0123456789-_.' characters only";
              break;
            case "valid":
              break;
            default:
              throw new Error(`"Unknown iovname validation error: ${checkResult}`);
          }

          if (checkResult !== "valid") {
            return errors;
          }

          const connection = await getConnectionForBns();
          const usernames = await connection.getUsernames({ username });
          if (usernames.length > 0) {
            errors[REGISTER_NAME_FIELD] = "Personalized address already exists";
            return errors;
          }
        }

        const addressesToRegister = getChainAddressPairsFromValues(formValues, chainAddresses);
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

      validate(values);
    },
    [chainAddresses, iovnameAddresses],
  );

  const initialValues = React.useMemo(() => getFormInitValues(chainAddressesItems), [chainAddressesItems]);
  const { form, handleSubmit, invalid, submitting, validating } = useForm({
    onSubmit: onSubmitCallback,
    validate: validateCallback,
    initialValues,
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
      <PageContent id={REGISTER_NAME_VIEW_ID} icon={registerIcon} buttons={buttons} avatarColor="#31E6C9">
        <Block textAlign="left">
          {iovnameAddresses && (
            <Typography variant="h4" align="center">
              {iovnameAddresses.username}
            </Typography>
          )}
          {!iovnameAddresses && (
            <React.Fragment>
              <Block display="flex" justifyContent="space-between" marginBottom={1}>
                <Typography variant="subtitle2" weight="semibold">
                  Register your new name
                </Typography>
                <Block display="flex" alignItems="center">
                  <Tooltip maxWidth={320}>
                    <TooltipContent header={<NoNameHeader />} title="Choose your address">
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
                  name={REGISTER_NAME_FIELD}
                  form={form}
                  placeholder="eg. yourname*iov"
                  fullWidth
                  margin="none"
                />
              </Block>
            </React.Fragment>
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
                    addresses. Just give your friends your starname.
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

export default NameForm;
