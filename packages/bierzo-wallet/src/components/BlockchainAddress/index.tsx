import { Address } from "@iov/bcp";
import { makeStyles } from "@material-ui/core";
import { Badge, Typography } from "medulas-react-components";
import React from "react";

const useStyles = makeStyles({
  sectionName: {
    overflowWrap: "break-word",
  },
});

interface Props {
  readonly userAddresses: readonly Address[];
  readonly address: Address;
}

const BlockchainAddress = ({ userAddresses, address }: Props): JSX.Element => {
  const classes = useStyles();

  const addressNode = (
    <Typography variant="subtitle2" weight="regular" color="textSecondary" className={classes.sectionName}>
      {address}
    </Typography>
  );

  if (userAddresses.includes(address)) {
    return (
      <Badge variant="text" badgeContent="me">
        {addressNode}
      </Badge>
    );
  } else {
    return addressNode;
  }
};

export default BlockchainAddress;
