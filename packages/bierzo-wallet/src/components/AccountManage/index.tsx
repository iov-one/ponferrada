import Paper from "@material-ui/core/Paper";
import clipboardCopy from "clipboard-copy";
import {
  ActionMenu,
  ActionMenuItem,
  Avatar,
  Block,
  Hairline,
  Image,
  makeStyles,
  ToastContext,
  ToastVariant,
  Tooltip,
  Typography,
} from "medulas-react-components";
import React from "react";

import { BwAccount } from "../../store/accounts";
import { BwUsername } from "../../store/usernames";
import { formatDate, formatTime } from "../../utils/date";
import AddressesTable, { ChainAddressPairWithName } from "../AddressesTable";
import copy from "../AddressesTable/assets/copy.svg";
import shield from "./assets/shield.svg";

const registerTooltipIcon = <Image src={shield} alt="shield" width={24} height={24} />;

const useTooltipHeaderStyles = makeStyles({
  addressesHeader: {
    backgroundColor: "#31E6C9",
    fontSize: "27.5px",
    width: 56,
    height: 56,
  },
});

export function AddressesTooltipHeader(): JSX.Element {
  const classes = useTooltipHeaderStyles();
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

export interface BwUsernameWithChainName extends BwUsername {
  readonly addresses: readonly ChainAddressPairWithName[];
}

export interface BwAccountWithChainName extends BwAccount {
  readonly addresses: readonly ChainAddressPairWithName[];
}

type AccountModuleMixedType = BwUsernameWithChainName | BwAccountWithChainName;

interface Props {
  readonly account: AccountModuleMixedType;
  readonly menuItems: readonly ActionMenuItem[];
  readonly onEditAccount: () => void;
}

export function isUsernameData(account: AccountModuleMixedType): account is BwUsernameWithChainName {
  return typeof (account as BwUsername).username !== "undefined";
}

export function isAccountData(account: AccountModuleMixedType): account is BwAccountWithChainName {
  return typeof (account as BwAccount).name !== "undefined";
}

const usePaper = makeStyles({
  rounded: {
    borderRadius: "5px",
  },
  elevation1: {
    boxShadow: "none",
  },
});

const useStyles = makeStyles({
  link: {
    cursor: "pointer",
  },
});

const AccountManage: React.FunctionComponent<Props> = ({ account, menuItems, onEditAccount }) => {
  const paperClasses = usePaper();
  const classes = useStyles();
  const toast = React.useContext(ToastContext);

  const onAccountCopy = (): void => {
    const name = isAccountData(account) ? account.name : account.username;
    clipboardCopy(name);
    toast.show("Account has been copied to clipboard.", ToastVariant.INFO);
  };

  const onEdit = (): void => {
    onEditAccount();
    // history.push(REGISTER_IOVNAME_ROUTE, account);
  };

  return (
    <Block marginTop={1} width={650}>
      <Paper classes={paperClasses}>
        <Block
          display="flex"
          flexDirection="column"
          width="100%"
          marginTop={4}
          padding={5}
          border="1px solid #F3F3F3"
        >
          <Block display="flex" alignItems="center" alignSelf="center">
            <Typography variant="h4" align="center">
              {isAccountData(account) ? account.name : account.username}
            </Typography>
            <Block marginRight={2} />
            <Block onClick={onAccountCopy} className={classes.link}>
              <Image src={copy} alt="Copy" width={20} />
            </Block>
          </Block>
          {isAccountData(account) && (
            <Typography variant="body2" inline align="center" color="textSecondary">
              Expires on {formatDate(account.expiryDate)} {formatTime(account.expiryDate)}
            </Typography>
          )}
          <Block display="flex" alignItems="center" marginBottom={1} marginTop={4}>
            <Block display="flex" alignItems="center" width={162}>
              <Typography variant="subtitle2" weight="semibold" inline>
                {account.addresses.length > 0 ? "LINKED ADDRESSES" : "NO LINKED ADDRESSES"}
              </Typography>

              <Block marginRight={1} />
              <Tooltip maxWidth={320}>
                <TooltipContent header={<AddressesTooltipHeader />} title="Your linked addresses">
                  With IOV you can have an universal blockchain address that is linked to all your addresses.
                  Just give your friends your personalized address.
                </TooltipContent>
              </Tooltip>
            </Block>
            <Block marginLeft={2} marginRight={2} flexGrow={1}>
              <Hairline color="grey.100" />
            </Block>
            <Typography
              variant="subtitle2"
              weight="semibold"
              inline
              link
              color="primary"
              align="right"
              onClick={onEdit}
            >
              {account.addresses.length > 0 ? "Edit" : "Link Now"}
            </Typography>
            <Block marginLeft={2} marginRight={2} borderColor="grey.100" borderLeft="1px solid" height={30} />
            <ActionMenu menuItems={menuItems} />
            <Block marginLeft={1} />
          </Block>
          <Block marginTop={2} />
          {account.addresses.length > 0 && <AddressesTable chainAddresses={account.addresses} />}
        </Block>
      </Paper>
    </Block>
  );
};

export default AccountManage;
