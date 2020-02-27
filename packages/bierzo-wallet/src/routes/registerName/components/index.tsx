import { Fee } from "@iov/bcp";
import {
  Avatar,
  Back,
  Block,
  Button,
  Form,
  FormValues,
  Hairline,
  Image,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
  useForm,
} from "medulas-react-components";
import React from "react";
import { amountToString } from "ui-logic";

import { AddressesTableProps, ChainAddressPairWithName } from "../../../components/AddressesTable";
import PageContent from "../../../components/PageContent";
import { BwUsernameWithChainName } from "../../addresses";
import shield from "../assets/shield.svg";
import SelectAddressesTable, {
  getAddressInputName,
  getBlockchainInputName,
  SelectAddressItem,
} from "./SelectAddressesTable";

export const REGISTER_USERNAME_VIEW_ID = "register-username-view-id";
export const REGISTER_USERNAME_FIELD = "register-username-field";

const registerIcon = <Image src={shield} alt="shield" />;
const registerTooltipIcon = <Image src={shield} alt="shield" width={24} height={24} />;

const useStyles = makeStyles({
  usernameHeader: {
    boxShadow: "0px 0px 14px #EDEFF4",
  },
  addressesHeader: {
    backgroundColor: "#31E6C9",
    fontSize: "27.5px",
    width: 56,
    height: 56,
  },
});

export function NoUsernameHeader(): JSX.Element {
  const classes = useStyles();
  return (
    <Block className={classes.usernameHeader} borderRadius={40} width={145} padding={1}>
      <Typography variant="subtitle1" weight="semibold" color="primary" align="center">
        yourname*iov
      </Typography>
    </Block>
  );
}

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

function getSubmitButtonCaption(fee: Fee | undefined): string {
  if (fee && fee.tokens) {
    return `Register for ${amountToString(fee.tokens)}`;
  }

  return "Register";
}

function getFormInitValues(addressItems: SelectAddressItem[]): FormValues {
  const initialValues: FormValues = {};
  addressItems.forEach(item => {
    initialValues[getAddressInputName(item.id)] = item.chain.address;
    initialValues[getBlockchainInputName(item.id)] = item.chain.chainName;
  });

  return initialValues;
}

function getAddressItems(chainAddresses: readonly ChainAddressPairWithName[]): SelectAddressItem[] {
  const addressItems: SelectAddressItem[] = [];
  chainAddresses.forEach((chain, index) => {
    addressItems.push({
      id: index.toString(),
      chain,
    });
  });

  return addressItems;
}

interface Props extends AddressesTableProps {
  readonly onSubmit: (values: object) => Promise<void>;
  readonly validate: (values: object) => Promise<object>;
  readonly onCancel: () => void;
  readonly iovnameAddresses: BwUsernameWithChainName | undefined;
  readonly transactionFee: Fee | undefined;
}

const Layout = ({
  chainAddresses,
  iovnameAddresses,
  validate,
  onSubmit,
  onCancel,
  transactionFee,
}: Props): JSX.Element => {
  const chainAddressesItems = React.useMemo(() => {
    if (iovnameAddresses) {
      return getAddressItems(iovnameAddresses.addresses);
    }
    return getAddressItems(chainAddresses);
  }, [chainAddresses, iovnameAddresses]);

  const initialValues = React.useMemo(() => getFormInitValues(chainAddressesItems), [chainAddressesItems]);
  const { form, handleSubmit, invalid, submitting, validating } = useForm({
    onSubmit,
    validate,
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
      <PageContent id={REGISTER_USERNAME_VIEW_ID} icon={registerIcon} buttons={buttons} avatarColor="#31E6C9">
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
                  Create your iovname
                </Typography>
                <Block display="flex" alignItems="center">
                  <Tooltip maxWidth={320}>
                    <TooltipContent header={<NoUsernameHeader />} title="Choose your address">
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
                  name={REGISTER_USERNAME_FIELD}
                  form={form}
                  placeholder="eg. username*iov"
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

export default Layout;
