import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import { Theme } from "@material-ui/core";
import { FormApi } from "final-form";
import {
  defaultColor,
  makeStyles,
  SelectField,
  SelectFieldItem,
  TextField,
  Typography,
} from "medulas-react-components";
import React from "react";

import {
  AddressesRowProps,
  AddressesTableProps,
  ChainAddressPairWithName,
} from "../../../components/AddressesTable";

const addressValueField = "address-value-field";
const blockchainValueField = "blockchain-value-field";

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

const blockChainItems: SelectFieldItem[] = [
  { name: "Lisk Devnet" },
  { name: "Ganache" },
  { name: "IOV Devnet" },
];

interface RowProps extends AddressesRowProps {
  readonly form: FormApi;
}

const AddressRow = ({ chain, form }: RowProps): JSX.Element => {
  const classes = useStyles();
  const cellClasses = {
    root: classes.cell,
  };

  return (
    <TableRow key={chain.chainId}>
      <TableCell classes={cellClasses} align="left">
        <SelectField
          fieldName={`${blockchainValueField}_${chain.chainId}`}
          form={form}
          maxWidth="100px"
          items={blockChainItems}
          initial={chain.chainName}
        />
      </TableCell>
      <TableCell classes={cellClasses} align="left">
        <TextField
          name={`${addressValueField}_${chain.chainId}`}
          form={form}
          placeholder="Add blockchain address"
          fullWidth
          value={chain.address}
          margin="none"
        />
      </TableCell>
      <TableCell classes={cellClasses} align="center" className={classes.copyCell}>
        <Typography variant="body2" link weight="semibold" color="primary">
          Remove
        </Typography>
      </TableCell>
    </TableRow>
  );
};

interface TableProps extends AddressesTableProps {
  readonly form: FormApi;
}

const SelectAddressesTable = ({ chainAddresses, form }: TableProps): JSX.Element => {
  const chainAddressesSorted = Array.from(chainAddresses).sort(
    (a: ChainAddressPairWithName, b: ChainAddressPairWithName) =>
      a.chainName.localeCompare(b.chainName, undefined, { sensitivity: "base" }),
  );

  return (
    <Table>
      <TableBody>
        {chainAddressesSorted.map(chain => (
          <AddressRow key={chain.chainId} chain={chain} form={form} />
        ))}
      </TableBody>
    </Table>
  );
};

export default SelectAddressesTable;
