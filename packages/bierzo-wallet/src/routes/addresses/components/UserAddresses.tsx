import Paper from "@material-ui/core/Paper";
import { Block, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import AddressesTable, { AddressesTableProps } from "../../../components/AddressesTable";

export const PAYMENT_CONFIRMATION_VIEW_ID = "payment-confirmation-view-id";

const usePaper = makeStyles({
  rounded: {
    borderRadius: "5px",
  },
  elevation1: {
    boxShadow: "none",
  },
});

interface Props extends AddressesTableProps {
  readonly onReturnToBalance: () => void;
}

const UserAddresses = ({ chainAddresses }: Props): JSX.Element => {
  const paperClasses = usePaper();

  return (
    <Block
      id={PAYMENT_CONFIRMATION_VIEW_ID}
      marginTop={4}
      display="flex"
      alignContent="center"
      justifyContent="center"
    >
      <Block width={650}>
        <Paper classes={paperClasses}>
          <Block
            display="flex"
            flexDirection="column"
            width="100%"
            marginTop={4}
            padding={5}
            border="1px solid #F3F3F3"
          >
            <Typography variant="subtitle2" weight="semibold">
              BLOCKCHAIN ADDRESSES
            </Typography>
            <Block marginTop={3} />
            <AddressesTable chainAddresses={chainAddresses} />
          </Block>
        </Paper>
      </Block>
    </Block>
  );
};

export default UserAddresses;
