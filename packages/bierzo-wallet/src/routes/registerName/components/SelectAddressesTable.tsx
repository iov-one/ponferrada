import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import { Theme } from "@material-ui/core";
import { FormApi } from "final-form";
import {
  defaultColor,
  InputGroup,
  makeStyles,
  SelectField,
  SelectFieldItem,
  TextField,
  Typography,
} from "medulas-react-components";
import React from "react";

import { ChainAddressPairWithName } from "../../../components/AddressesTable";

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

export interface SelectAddressItem {
  readonly id: string;
  readonly chain: ChainAddressPairWithName;
}

interface RowProps {
  readonly form: FormApi;
  readonly index: number;
  readonly addressItem: SelectAddressItem;
  readonly blockChainItems: SelectFieldItem[];
  readonly removeAddress: (idx: number) => void;
}

const AddressRow = ({ addressItem, form, index, blockChainItems, removeAddress }: RowProps): JSX.Element => {
  const classes = useStyles();
  const cellClasses = {
    root: classes.cell,
  };

  const onRemove = (): void => {
    removeAddress(index);
  };

  return (
    <TableRow>
      <TableCell classes={cellClasses} align="left">
        <InputGroup
          prepend={
            <SelectField
              fieldName={`${addressItem.id}_${blockchainValueField}`}
              form={form}
              maxWidth="200px"
              items={blockChainItems}
              initial={addressItem.chain.chainName}
              placeholder="Select"
            />
          }
        >
          <TextField
            name={`${addressItem.id}_${addressValueField}`}
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

interface TableProps {
  readonly form: FormApi;
  readonly blockChainItems: SelectFieldItem[];
  readonly chainAddresses: SelectAddressItem[];
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
        {chainAddresses.map((addressItem, index) => (
          <AddressRow
            key={addressItem.id}
            index={index}
            addressItem={addressItem}
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
