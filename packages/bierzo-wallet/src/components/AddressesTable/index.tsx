import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChainAddressPair } from "@iov/bns";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import clipboardCopy from "clipboard-copy";
import { Block, makeStyles, ToastContext, ToastVariant } from "medulas-react-components";
import React from "react";

export interface ChainAddressPairWithName extends ChainAddressPair {
  readonly chainName: string;
}

const useStyles = makeStyles({
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
  link: {
    cursor: "pointer",
  },
});

export interface AddressesRowProps {
  readonly chain: ChainAddressPairWithName;
}

const AddressRow = ({ chain }: AddressesRowProps): JSX.Element => {
  const toast = React.useContext(ToastContext);
  const classes = useStyles();

  const onAddressCopy = (): void => {
    clipboardCopy(chain.address);
    toast.show("Address has been copied to clipboard.", ToastVariant.INFO);
  };

  return (
    <TableRow key={chain.chainId}>
      <TableCell align="left">{chain.chainName}</TableCell>
      <TableCell align="left">{chain.address}</TableCell>
      <TableCell align="left" className={classes.copyCell}>
        <Block onClick={onAddressCopy} className={classes.link}>
          <FontAwesomeIcon icon={faCopy} />
        </Block>
      </TableCell>
    </TableRow>
  );
};

export interface AddressesTableProps {
  readonly chainAddresses: readonly ChainAddressPairWithName[];
}

const AddressesTable = ({ chainAddresses }: AddressesTableProps): JSX.Element => {
  const classes = useStyles();

  const chainAddressesSorted = Array.from(chainAddresses).sort(
    (a: ChainAddressPairWithName, b: ChainAddressPairWithName) =>
      a.chainName.localeCompare(b.chainName, undefined, { sensitivity: "base" }),
  );

  return (
    <Table>
      <TableHead>
        <TableRow className={classes.header}>
          <TableCell align="center">Blockchain</TableCell>
          <TableCell align="center">Address</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {chainAddressesSorted.map(chain => (
          <AddressRow key={chain.chainId} chain={chain} />
        ))}
      </TableBody>
    </Table>
  );
};

export default AddressesTable;
