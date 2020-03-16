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

import { ChainAddressPairWithName } from "../AddressesTable";

export const addressValueField = "address-value-field";
export const blockchainValueField = "blockchain-value-field";
const emptySelectorName = "Select";

export const getAddressInputName = (id: string): string => `${id}-${addressValueField}`;
export const getBlockchainInputName = (id: string): string => `${id}-${blockchainValueField}`;

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
  const [selectedBlockchain, setSelectedBlockchain] = React.useState<SelectFieldItem>({
    name: addressItem.chain.chainName,
  });

  const onRemove = (): void => {
    addBlockchainItem(selectedBlockchain);
    removeAddress(index);
  };

  const onSelectionChanged = (value: SelectFieldItem | undefined): void => {
    if (value) {
      addBlockchainItem(selectedBlockchain);
      setSelectedBlockchain(value);
      removeBlockchainItem(value);
    }
  };

  return (
    <TableRow>
      <TableCell classes={cellClasses} align="left">
        <InputGroup
          prepend={
            <SelectField
              fieldName={getBlockchainInputName(addressItem.id)}
              form={form}
              maxWidth="200px"
              items={blockChainItems}
              initial={addressItem.chain.chainName}
              placeholder={blockChainItems.length > 0 ? emptySelectorName : undefined}
              onChangeCallback={onSelectionChanged}
            />
          }
        >
          <TextField
            name={getAddressInputName(addressItem.id)}
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
  readonly chainAddressesItems: SelectAddressItem[];
  readonly availableBlockchains: readonly ChainAddressPairWithName[];
}

const SelectAddressesTable = ({
  availableBlockchains,
  chainAddressesItems,
  form,
}: TableProps): JSX.Element => {
  const [chainItems, setChainItems] = React.useState<SelectAddressItem[]>([]);
  const [blockChainItems, setBlockchainItems] = React.useState<SelectFieldItem[]>([]);

  React.useEffect(() => {
    const addressesChains = chainAddressesItems.map(address => address.chain.chainId);
    const items = availableBlockchains
      .filter(item => !addressesChains.includes(item.chainId))
      .map(item => ({ name: item.chainName }));

    setBlockchainItems(items);
    setChainItems(chainAddressesItems);
  }, [availableBlockchains, chainAddressesItems]);

  const removeBlockchainItem = (chain: SelectFieldItem): void => {
    setBlockchainItems(oldItems => {
      const newItem = oldItems.filter(item => item.name !== chain.name);
      return newItem;
    });
  };

  const addBlockchainItem = (chain: SelectFieldItem): void => {
    if (chain.name !== emptySelectorName) {
      setBlockchainItems(oldItems => {
        const newItem = [...oldItems, chain];
        newItem.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
        return newItem;
      });
    }
  };

  const addAddress = (): void => {
    const newItems = [
      ...chainItems,
      {
        id: randomString(5),
        chain: {
          address: "" as Address,
          chainId: "" as ChainId,
          chainName: emptySelectorName,
        },
      },
    ];
    setChainItems(newItems);
  };

  const removeAddress = (idx: number): void => {
    const newItems = [...chainItems];
    const [removedItem] = newItems.splice(idx, 1);

    form.batch(() => {
      form.change(getBlockchainInputName(removedItem.id), null);
      form.change(getAddressInputName(removedItem.id), null);
    });

    setChainItems(newItems);
  };

  const allowAddChain = chainItems.length < availableBlockchains.length;

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
      {allowAddChain && (
        <Typography link color="primary" onClick={addAddress}>
          + Add more
        </Typography>
      )}
    </React.Fragment>
  );
};

export default SelectAddressesTable;
