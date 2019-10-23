import {
  Avatar,
  Back,
  Block,
  Button,
  Form,
  Image,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
  useForm,
} from "medulas-react-components";
import React from "react";

import AddressesTable, { AddressesTableProps } from "../../../components/AddressesTable";
import PageContent from "../../../components/PageContent";
import shield from "../assets/shield.svg";

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

function UsernameTooltipHeader(): JSX.Element {
  const classes = useStyles();
  return (
    <Block className={classes.usernameHeader} borderRadius={40} width={145} padding={1}>
      <Typography variant="subtitle1" weight="semibold" color="primary" align="center">
        yourname*iov
      </Typography>
    </Block>
  );
}

function AddressesTooltipHeader(): JSX.Element {
  const classes = useStyles();
  const avatarClasses = { root: classes.addressesHeader };
  return <Avatar classes={avatarClasses}>{registerTooltipIcon}</Avatar>;
}

interface TooltipContentProps {
  readonly header: React.ReactNode;
  readonly title: string;
  readonly children: React.ReactNode;
}

function TooltipContent({ children, title, header }: TooltipContentProps): JSX.Element {
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

interface Props extends AddressesTableProps {
  readonly onSubmit: (values: object) => Promise<void>;
  readonly validate: (values: object) => Promise<object>;
  readonly onCancel: () => void;
}

const Layout = ({ chainAddresses, validate, onSubmit, onCancel }: Props): JSX.Element => {
  const { form, handleSubmit, invalid, pristine, submitting, validating } = useForm({
    onSubmit,
    validate,
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
          disabled={invalid || pristine || submitting || validating}
          spinner={submitting || validating}
        >
          Register
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
          <Block display="flex" justifyContent="space-between" marginBottom={1}>
            <Typography variant="subtitle2" weight="semibold">
              Your personalized address
            </Typography>
            <Block display="flex" alignItems="center">
              <Tooltip maxWidth={320}>
                <TooltipContent header={<UsernameTooltipHeader />} title="Choose your address">
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
          <Block width="100%" marginTop={3} marginBottom={1}>
            <Block display="flex" alignItems="center" marginBottom={1}>
              <Typography variant="subtitle2" weight="semibold" inline>
                WILL BE LINKED TO THESE ADDRESSES
              </Typography>
              <Block marginRight={1} />
              <Tooltip maxWidth={320}>
                <TooltipContent header={<AddressesTooltipHeader />} title="Your linked addresses">
                  With IOV you can have an universal blockchain address that is linked to all your addresses.
                  Just give your friends your personalized address.
                </TooltipContent>
              </Tooltip>
            </Block>
            <Block>
              <AddressesTable chainAddresses={chainAddresses} />
            </Block>
          </Block>
        </Block>
      </PageContent>
    </Form>
  );
};

export default Layout;
