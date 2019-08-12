import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Theme } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import { useTheme } from "@material-ui/styles";
import { Block, Button, makeStyles } from "medulas-react-components";
import React from "react";

import AddressesTable, { AddressesTableProps } from "../../../components/AddressesTable";

export const PAYMENT_CONFIRMATION_VIEW_ID = "payment-confirmation-view-id";

const useAvatar = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: "#ffe152",
    fontSize: "27.5px",
    width: "72px",
    height: "72px",
    margin: "-76px 0 40px 0",
  },
}));

interface Props extends AddressesTableProps {
  readonly onReturnToBalance: () => void;
}

const ReceivePayment = ({ addresses, onReturnToBalance }: Props): JSX.Element => {
  const avatarClasses = useAvatar();
  const theme = useTheme<Theme>();

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
            <AddressesTable addresses={addresses} />
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
