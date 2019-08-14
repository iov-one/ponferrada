import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Address, ChainId } from "@iov/bcp";
import { ChainAddressPair } from "@iov/bns";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { makeStyles, ToastContext, ToastVariant } from "medulas-react-components";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";

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
});

export interface AddressesTableProps {
  readonly addresses: ChainAddressPair[];
}

const AddressesTable = ({ addresses }: AddressesTableProps): JSX.Element => {
  const toast = React.useContext(ToastContext);
  const classes = useStyles();

  const [chainAddresses, setChainAddresses] = React.useState<readonly ChainAddress[]>([]);

  React.useEffect(() => {
    async function processAddresses(addresses: ChainAddressPair[]): Promise<void> {
      const chainAddresses = await chainAddressPairSortedMapping(addresses);
      setChainAddresses(chainAddresses);
    }
    processAddresses(addresses);
  }, [addresses]);

  const onAddressCopy = (): void => {
    toast.show("Address has been copied to clipboard.", ToastVariant.INFO);
  };

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
          <TableRow key={chain.chainId}>
            <TableCell align="left">{chain.chainName}</TableCell>
            <TableCell align="left">{chain.address}</TableCell>
            <TableCell align="left" className={classes.copyCell}>
              <CopyToClipboard text={chain.address} onCopy={onAddressCopy}>
                <FontAwesomeIcon icon={faCopy} />
              </CopyToClipboard>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AddressesTable;
