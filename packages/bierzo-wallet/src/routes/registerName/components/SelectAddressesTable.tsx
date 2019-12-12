import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import { Theme } from "@material-ui/core";
import { FormApi } from "final-form";
import {
  defaultColor,
  FormValues,
  InputGroup,
  makeStyles,
  SelectField,
  SelectFieldItem,
  TextField,
  Typography,
} from "medulas-react-components";
import React from "react";

import { AddressesRowProps, AddressesTableProps } from "../../../components/AddressesTable";

export const addressValueField = "address-value-field";
export const blockchainValueField = "blockchain-value-field";

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

interface RowProps extends AddressesRowProps {
  readonly form: FormApi;
  readonly index: number;
  readonly blockChainItems: SelectFieldItem[];
  readonly removeAddress: (idx: number) => void;
}

const AddressRow = ({ chain, form, index, blockChainItems, removeAddress }: RowProps): JSX.Element => {
  const classes = useStyles();
  const cellClasses = {
    root: classes.cell,
  };

  const onRemove = (): void => {
    removeAddress(index);
  };

  console.log(
    `${chain.chainId}_${blockchainValueField}_${index}`,
    `${chain.chainId}_${addressValueField}_${index}`,
  );

  return (
    <TableRow key={chain.chainId}>
      <TableCell classes={cellClasses} align="left">
        <InputGroup
          prepend={
            <SelectField
              fieldName={`${chain.chainId}_${blockchainValueField}_${index}`}
              form={form}
              maxWidth="200px"
              items={blockChainItems}
              initial={chain.chainName}
              placeholder="Select"
            />
          }
        >
          <TextField
            name={`${chain.chainId}_${addressValueField}_${index}`}
            form={form}
            placeholder="Add blockchain address"
            fullWidth
            margin="none"
          />
        </InputGroup>
      </TableCell>
      <TableCell classes={cellClasses} align="center" className={classes.copyCell}>
        <Typography variant="body2" link weight="semibold" color="primary" onClick={onRemove}>
          Remove
        </Typography>
      </TableCell>
    </TableRow>
  );
};

interface TableProps extends AddressesTableProps {
  readonly form: FormApi;
  readonly blockChainItems: SelectFieldItem[];
  readonly removeAddress: (idx: number) => void;
}

const SelectAddressesTable = ({
  chainAddresses,
  removeAddress,
  form,
  blockChainItems,
}: TableProps): JSX.Element => {
  return (
    <Table>
      <TableBody>
        {chainAddresses.map((chain, index) => (
          <AddressRow
            key={`${chain.chainId}_${index}`}
            index={index}
            chain={chain}
            form={form}
            blockChainItems={blockChainItems}
            removeAddress={removeAddress}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default SelectAddressesTable;
