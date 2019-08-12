import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Address, ChainId } from "@iov/bcp";
import { ChainAddressPair } from "@iov/bns";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { ToastContext } from "medulas-react-components/lib/context/ToastProvider";
import { ToastVariant } from "medulas-react-components/lib/context/ToastProvider/Toast";
import makeStyles from "medulas-react-components/lib/theme/utils/styles";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import * as ReactRedux from "react-redux";

import { getChainName } from "../../config";
import { RootState } from "../../store/reducers";

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

  const pubKeys = ReactRedux.useSelector((state: RootState) => state.extension.keys);

  const [chainAddresses, setChainAddresses] = React.useState<readonly ChainAddress[]>([]);

  React.useEffect(() => {
    async function processAddresses(addresses: ChainAddressPair[]): Promise<void> {
      const chainAddresses: ChainAddress[] = [];
      for (const address of addresses) {
        chainAddresses.push({
          ...address,
          chainName: await getChainName(address.chainId),
        });
      }
      chainAddresses.sort((a: ChainAddress, b: ChainAddress) =>
        a.chainName.localeCompare(b.chainName, undefined, { sensitivity: "base" }),
      );

      setChainAddresses(chainAddresses);
    }
    processAddresses(addresses);
  }, [addresses, pubKeys]);

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
