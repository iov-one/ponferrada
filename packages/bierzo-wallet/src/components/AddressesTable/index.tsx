import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Address, ChainId } from "@iov/bcp";
import { ChainAddressPair } from "@iov/bns";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import clipboardCopy from "clipboard-copy";
import { Block, makeStyles, ToastContext, ToastVariant } from "medulas-react-components";
import React from "react";

import { chainAddressPairSortedMapping } from "../../utils/tokens";

export interface ChainAddress {
  readonly chainId: ChainId;
  readonly chainName: string;
  readonly address: Address;
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
  readonly chain: ChainAddress;
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
  readonly addresses: ChainAddressPair[];
}

const AddressesTable = ({ addresses }: AddressesTableProps): JSX.Element => {
  const classes = useStyles();

  const [chainAddresses, setChainAddresses] = React.useState<readonly ChainAddress[]>([]);

  React.useEffect(() => {
    let isSubscribed = true;
    async function processAddresses(addresses: ChainAddressPair[]): Promise<void> {
      const chainAddresses = await chainAddressPairSortedMapping(addresses);
      if (isSubscribed) {
        setChainAddresses(chainAddresses);
      }
    }
    processAddresses(addresses);

    return () => {
      isSubscribed = false;
    };
  }, [addresses]);

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
        {chainAddresses.map(chain => (
          <AddressRow key={chain.chainId} chain={chain} />
        ))}
      </TableBody>
    </Table>
  );
};

export default AddressesTable;
