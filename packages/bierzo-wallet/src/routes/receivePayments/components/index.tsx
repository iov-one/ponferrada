import { faCopy, faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Address, ChainId } from "@iov/bcp";
import { Table, TableBody, TableCell, TableHead, TableRow, Theme } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import { useTheme } from "@material-ui/styles";
import Block from "medulas-react-components/lib/components/Block";
import Button from "medulas-react-components/lib/components/Button";
import { ToastContext } from "medulas-react-components/lib/context/ToastProvider";
import { ToastVariant } from "medulas-react-components/lib/context/ToastProvider/Toast";
import makeStyles from "medulas-react-components/lib/theme/utils/styles";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import AddressesTable from "../../../components/AddressesTable";

export interface ChainAddress {
  readonly chainId: ChainId;
  readonly chainName: string;
  readonly address: Address;
}

export const PAYMENT_CONFIRMATION_VIEW_ID = "payment-confirmation-view-id";

const useTable = makeStyles({
  header: {
    "& > th": {
      fontSize: "1.6rem",
    },
  },
  copyCell: {
    "& > svg": {
      cursor: "pointer",
    },
  },
});

const useAvatar = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: "#ffe152",
    fontSize: "27.5px",
    width: "72px",
    height: "72px",
    margin: "-76px 0 40px 0",
  },
}));

interface Props {
  readonly chainAddresses: readonly ChainAddress[];
  readonly onReturnToBalance: () => void;
}

const ReceivePayment = ({ chainAddresses, onReturnToBalance }: Props): JSX.Element => {
  const toast = React.useContext(ToastContext);
  const avatarClasses = useAvatar();
  const tableClasses = useTable();
  const theme = useTheme<Theme>();

  const onAddressCopy = (): void => {
    toast.show("Address has been copied to clipboard.", ToastVariant.INFO);
  };

  return (
    <Block
      id={PAYMENT_CONFIRMATION_VIEW_ID}
      marginTop={4}
      display="flex"
      alignContent="center"
      justifyContent="center"
      bgcolor={theme.palette.background.default}
    >
      <Block width={650}>
        <Paper>
          <Block
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            marginTop={4}
            paddingTop={5}
            padding={3}
          >
            <Avatar classes={avatarClasses}>
              <FontAwesomeIcon icon={faUser} color="#ffffff" />
            </Avatar>
            <AddressesTable chainAddresses={chainAddresses} />
          </Block>
        </Paper>

        <Block marginTop={4} marginBottom={1}>
          <Button fullWidth onClick={onReturnToBalance}>
            Return to Balance
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default ReceivePayment;
