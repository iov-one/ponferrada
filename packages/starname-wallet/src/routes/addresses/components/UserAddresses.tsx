import Paper from "@material-ui/core/Paper";
import { Block, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import AddressesTable, { AddressesTableProps } from "../../../components/AddressesTable";

export const yourBlockchainAddressesId = "your-blockchain-addresses-id";

const usePaper = makeStyles({
  rounded: {
    borderRadius: "5px",
  },
  elevation1: {
    boxShadow: "none",
  },
});

const UserAddresses = ({ chainAddresses }: AddressesTableProps): JSX.Element => {
  const paperClasses = usePaper();

  return (
    <Block marginTop={1} width={650} id={yourBlockchainAddressesId}>
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
  );
};

export default UserAddresses;
