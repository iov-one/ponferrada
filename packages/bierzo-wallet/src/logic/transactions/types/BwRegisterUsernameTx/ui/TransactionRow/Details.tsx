import { ChainAddressPair, RegisterUsernameTx } from "@iov/bns";
import { makeStyles } from "@material-ui/core";
import { Table, TableBody, TableCell, TableHead, TableRow, Theme } from "@material-ui/core";
import { Block, Typography } from "medulas-react-components";
import * as React from "react";

import { ChainAddressPairWithName } from "../../../../../../components/AddressesTable";
import { chainAddressPairSortedMapping } from "../../../../../../utils/tokens";
import { ProcessedTx } from "../../../../types/BwParser";

const useStyles = makeStyles((theme: Theme) => ({
  sectionName: {
    overflowWrap: "break-word",
  },
  tableHeader: {
    "& > th": {
      fontSize: "1.4rem",
      color: theme.palette.text.primary,
      padding: `${theme.spacing(1)}px ${theme.spacing(4)}px ${theme.spacing(1)}px 0`,
    },
  },
  tableBody: {
    "& > td": {
      fontSize: "1.4rem",
      color: theme.palette.text.secondary,
      paddingLeft: 0,
      padding: `${theme.spacing(1)}px ${theme.spacing(4)}px ${theme.spacing(1)}px 0`,
    },
  },
}));

interface Props {
  readonly tx: ProcessedTx<RegisterUsernameTx>;
}

const TxDetails = ({ tx }: Props): JSX.Element => {
  const classes = useStyles();
  const [addresses, setAddresses] = React.useState<readonly ChainAddressPairWithName[]>([]);

  React.useEffect(() => {
    async function processAddresses(addresses: readonly ChainAddressPair[]): Promise<void> {
      const chainAddresses = await chainAddressPairSortedMapping(addresses);
      setAddresses(chainAddresses);
    }
    processAddresses(tx.original.targets);
  }, [tx.original.targets]);

  return (
    <Block paddingLeft="56px" display="flex" flexDirection="column">
      <Block margin={2} />
      <Block>
        <Typography variant="subtitle2" weight="regular" gutterBottom>
          Personalized address:
        </Typography>
        <Typography
          variant="subtitle2"
          weight="regular"
          color="textSecondary"
          className={classes.sectionName}
        >
          {tx.original.username}
        </Typography>
        <Typography>&nbsp;</Typography>
        <Table>
          <TableHead>
            <TableRow className={classes.tableHeader}>
              <TableCell align="left">Blockchain</TableCell>
              <TableCell align="left">Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addresses.map(chain => (
              <TableRow key={chain.chainId} className={classes.tableBody}>
                <TableCell align="left">{chain.chainName}</TableCell>
                <TableCell align="left">{chain.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Block>
    </Block>
  );
};

export default TxDetails;
