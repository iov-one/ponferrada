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
  Hairline,
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

import {
  generateRegisterUsernameTxRequest,
  generateRegisterUsernameTxWithFee,
} from "../../../../communication/requestgenerators";
import { RpcEndpoint } from "../../../../communication/rpcEndpoint";
import {
  getAddressItems,
  getChainAddressPairsFromValues,
  getFormInitValues,
  getSubmitButtonCaption,
} from "../../../../components/AccountEdit";
import { AddressesTooltipHeader, TooltipContent } from "../../../../components/AccountManage";
import { AddressesTableProps } from "../../../../components/AddressesTable";
import LedgerBillboardMessage from "../../../../components/BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "../../../../components/BillboardMessage/NeumaBillboardMessage";
import PageContent from "../../../../components/PageContent";
import { isValidIov } from "../../../../logic/account";
import shield from "../assets/shield.svg";
import SelectAddressesTable from "./SelectAddressesTable";

export const REGISTER_IOVNAME_VIEW_ID = "register-iovname-view-id";
export const REGISTER_IOVNAME_FIELD = "register-iovname-field";

const registerIcon = <Image src={shield} alt="shield" />;

const useStyles = makeStyles({
  iovnameHeader: {
    boxShadow: "0px 0px 14px #EDEFF4",
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

interface Props extends AddressesTableProps {
  readonly onCancel: () => void;
  readonly bnsIdentity: Identity;
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<TransactionId | null>>;
}

const IovnameForm = ({
  chainAddresses,
  bnsIdentity,
  rpcEndpoint,
  onCancel,
  setTransactionId,
}: Props): JSX.Element => {
  const [transactionFee, setTransactionFee] = React.useState<Fee | undefined>();
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

  const chainAddressesItems = React.useMemo(() => {
    return getAddressItems(chainAddresses);
  }, [chainAddresses]);

  const onSubmit = async (values: object): Promise<void> => {
    const formValues = values as FormValues;

    const addressesToRegister = getChainAddressPairsFromValues(formValues, chainAddresses);

    try {
      const request = await generateRegisterUsernameTxRequest(
        bnsIdentity,
        formValues[REGISTER_IOVNAME_FIELD],
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

  const initialValues = React.useMemo(() => getFormInitValues(chainAddressesItems), [chainAddressesItems]);
  const { form, handleSubmit, invalid, submitting, validating, values } = useForm({
    onSubmit,
    initialValues,
  });

  React.useEffect(() => {
    let isSubscribed = true;

    async function setFee(): Promise<void> {
      const formValues = values as FormValues;
      const addressesToRegister = getChainAddressPairsFromValues(formValues, chainAddresses);

      const fee = (
        await generateRegisterUsernameTxWithFee(
          bnsIdentity,
          formValues[REGISTER_IOVNAME_FIELD],
          addressesToRegister,
        )
      ).fee;

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
  }, [bnsIdentity, chainAddresses, invalid, values]);

  const iovnameValidator: FieldValidator<FieldInputValue> = (value): string | undefined => {
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

    return undefined;
  };

  /* const validateIovnameExistsAndAddresses = React.useCallback(
    (values: object) => {
      const validate = async (values: object): Promise<object> => {
        const formValues = values as FormValues;
        const errors: ValidationError = {};

        const connection = await getConnectionForBns();
        const username = formValues[REGISTER_IOVNAME_FIELD];
        const usernames = await connection.getUsernames({ username: username });
        if (usernames.length > 0) {
          errors[REGISTER_IOVNAME_FIELD] = "Iovname already exists";
          return errors;
        }

        const addressesToRegister = getChainAddressPairsFromValues(formValues, chainAddresses);
        for (const address of addressesToRegister) {
          try {
            const codec = await getCodecForChainId(address.chainId);
            if (!codec.isValidAddress(address.address)) {
              const addressField = Object.entries(formValues).find(([_id, value]) => value === address.address);
              if (addressField) {
                errors[addressField[0]] = "Not valid blockchain address";
              }
            }
          } catch (err) {
            console.info(err);
          }
        }

        return errors;
      };

      validate(values);
    },
    [chainAddresses],
  ); */

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
      <PageContent id={REGISTER_IOVNAME_VIEW_ID} icon={registerIcon} buttons={buttons} avatarColor="#31E6C9">
        <Block textAlign="left">
          <React.Fragment>
            <Block display="flex" justifyContent="space-between" marginBottom={1}>
              <Typography variant="subtitle2" weight="semibold">
                Create your iovname
              </Typography>
              <Block display="flex" alignItems="center">
                <Tooltip maxWidth={320}>
                  <TooltipContent header={<NoIovnameHeader />} title="Choose your address">
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
                name={REGISTER_IOVNAME_FIELD}
                form={form}
                validate={iovnameValidator}
                placeholder="eg. yourname*iov"
                fullWidth
                margin="none"
              />
            </Block>
          </React.Fragment>

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

export default IovnameForm;
