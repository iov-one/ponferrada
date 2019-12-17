import { Address, ChainId } from "@iov/bcp";
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
import { randomString } from "ui-logic";

import { ChainAddressPairWithName } from "../../../components/AddressesTable";

export const addressValueField = "address-value-field";
export const blockchainValueField = "blockchain-value-field";
export const fieldValueIdxLength = 5;

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
  readonly removeBlockchainItem: (chain: SelectFieldItem) => void;
  readonly addBlockchainItem: (chain: SelectFieldItem) => void;
}

const AddressRow = ({
  addressItem,
  form,
  index,
  blockChainItems,
  removeAddress,
  removeBlockchainItem,
  addBlockchainItem,
}: RowProps): JSX.Element => {
  const classes = useStyles();
  const cellClasses = {
    root: classes.cell,
  };

  const onRemove = (): void => {
    addBlockchainItem({ name: addressItem.chain.chainName });
    removeAddress(index);
  };

  const onSelectionChanged = (value: SelectFieldItem | undefined): void => {
    if (value) {
      addBlockchainItem({ name: addressItem.chain.chainName });
      removeBlockchainItem(value);
    }
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
              placeholder={blockChainItems.length > 0 ? "Select" : undefined}
              onChangeCallback={onSelectionChanged}
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
  readonly chainAddresses: SelectAddressItem[];
}

const SelectAddressesTable = ({ chainAddresses, form }: TableProps): JSX.Element => {
  const [chainItems, setChainItems] = React.useState<SelectAddressItem[]>(chainAddresses);
  const [blockChainItems, setBlockchainItems] = React.useState<SelectFieldItem[]>([]);

  const removeBlockchainItem = (chain: SelectFieldItem): void => {
    const newItem = blockChainItems.filter(item => item.name !== chain.name);
    setBlockchainItems(newItem);
  };

  const addBlockchainItem = (chain: SelectFieldItem): void => {
    const newItem = [...blockChainItems];
    newItem.push(chain);
    newItem.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    setBlockchainItems(newItem);
  };

  const addAddress = (): void => {
    const newItems = [...chainItems];
    newItems.push({
      id: randomString(fieldValueIdxLength),
      chain: {
        address: "" as Address,
        chainId: "" as ChainId,
        chainName: "Select",
      },
    });
    setChainItems(newItems);
  };

  const removeAddress = (idx: number): void => {
    const newItems = [...chainItems];
    const [removedItem] = newItems.splice(idx, 1);

    form.batch(() => {
      form.change(`${removedItem.id}_${blockchainValueField}`, null);
      form.change(`${removedItem.id}_${addressValueField}`, null);
    });

    setChainItems(newItems);
  };

  return (
    <React.Fragment>
      <Table>
        <TableBody>
          {chainItems.map((addressItem, index) => (
            <AddressRow
              key={addressItem.id}
              index={index}
              addressItem={addressItem}
              form={form}
              blockChainItems={blockChainItems}
              removeAddress={removeAddress}
              removeBlockchainItem={removeBlockchainItem}
              addBlockchainItem={addBlockchainItem}
            />
          ))}
        </TableBody>
      </Table>
      {blockChainItems.length > 0 && (
        <Typography link color="primary" onClick={addAddress}>
          + Add more
        </Typography>
      )}
    </React.Fragment>
  );
};

export default SelectAddressesTable;
