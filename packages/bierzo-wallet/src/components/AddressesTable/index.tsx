import { ChainAddressPair } from "@iov/bns";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Theme } from "@material-ui/core";
import clipboardCopy from "clipboard-copy";
import { Block, Image, makeStyles, ToastContext, ToastVariant } from "medulas-react-components";
import { defaultColor } from "medulas-react-components";
import React from "react";

import copy from "./assets/copy.svg";

export interface ChainAddressPairWithName extends ChainAddressPair {
  readonly chainName: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  cell: {
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px ${theme.spacing(1)}px 0`,
    borderBottom: "1px solid #F3F3F3",
  },
  cellHead: {
    fontSize: "1.6rem",
    border: "none",
    fontWeight: "normal",
    color: defaultColor,
    paddingBottom: `${theme.spacing(2)}px`,
  },
  copyCell: {
    "& > svg": {
      cursor: "pointer",
    },
    paddingRight: 0,
  },
  link: {
    cursor: "pointer",
  },
}));

export interface AddressesRowProps {
  readonly chain: ChainAddressPairWithName;
}

const AddressRow = ({ chain }: AddressesRowProps): JSX.Element => {
  const toast = React.useContext(ToastContext);
  const classes = useStyles();
  const cellClasses = {
    root: classes.cell,
  };

  const onAddressCopy = (): void => {
    clipboardCopy(chain.address);
    toast.show("Address has been copied to clipboard.", ToastVariant.INFO);
  };

  return (
    <TableRow key={chain.chainId}>
      <TableCell classes={cellClasses} align="left">
        {chain.chainName}
      </TableCell>
      <TableCell classes={cellClasses} align="left">
        {chain.address}
      </TableCell>
      <TableCell classes={cellClasses} align="center" className={classes.copyCell}>
        <Block onClick={onAddressCopy} className={classes.link}>
          <Image src={copy} alt="Copy" width={14} />
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
  const cellClasses = {
    root: classes.cell,
    head: classes.cellHead,
  };

  const chainAddressesSorted = chainAddresses
    .slice()
    .sort((a: ChainAddressPairWithName, b: ChainAddressPairWithName) =>
      a.chainName.localeCompare(b.chainName, undefined, { sensitivity: "base" }),
    );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell classes={cellClasses} align="left">
            Blockchain
          </TableCell>
          <TableCell classes={cellClasses} align="left">
            Address
          </TableCell>
          <TableCell classes={cellClasses} />
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
