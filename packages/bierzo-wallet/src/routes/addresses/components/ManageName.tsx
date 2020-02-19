import Paper from "@material-ui/core/Paper";
import clipboardCopy from "clipboard-copy";
import {
  ActionMenu,
  ActionMenuItem,
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

import { BwUsernameWithChainName } from "..";
import { history } from "../..";
import AddressesTable from "../../../components/AddressesTable";
import copy from "../../../components/AddressesTable/assets/copy.svg";
import { REGISTER_PERSONALIZED_ADDRESS_ROUTE } from "../../paths";
import { AddressesTooltipHeader, TooltipContent } from "../../registerName/components";

interface Props {
  readonly account: BwUsernameWithChainName;
  readonly onRegisterUsername: () => void;
}

const usePaper = makeStyles({
  rounded: {
    borderRadius: "5px",
  },
  elevation1: {
    boxShadow: "none",
  },
});

const menuItems: ActionMenuItem[] = [
  { title: "Renew", action: () => console.log("Renew") },
  { title: "Transfer iovname", action: () => console.log("Transfer iovname") },
  { title: "Delete iovname", action: () => console.log("Delete iovname") },
];

const useStyles = makeStyles({
  link: {
    cursor: "pointer",
  },
});

const ManageName: React.FunctionComponent<Props> = ({ account, onRegisterUsername }) => {
  const paperClasses = usePaper();
  const classes = useStyles();
  const toast = React.useContext(ToastContext);

  const onAccountCopy = (): void => {
    clipboardCopy(account.username);
    toast.show("Account has been copied to clipboard.", ToastVariant.INFO);
  };

  const onEdit = (): void => {
    history.push(REGISTER_PERSONALIZED_ADDRESS_ROUTE, account);
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
              {account.username}
            </Typography>
            <Block marginRight={2} />
            <Block onClick={onAccountCopy} className={classes.link}>
              <Image src={copy} alt="Copy" width={20} />
            </Block>
          </Block>
          <Typography variant="body2" inline align="center" color="textSecondary">
            Expires on 19/12/2025
          </Typography>
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

export default ManageName;
