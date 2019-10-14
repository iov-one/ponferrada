import { Electors } from "@iov/bns";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Typography } from "medulas-react-components";
import React from "react";

interface Props {
  readonly electors: Electors;
}

const MembersTable = ({ electors }: Props): JSX.Element => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Address</TableCell>
          <TableCell align="right">Weight</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(electors).map(address => (
          <TableRow key={address}>
            <TableCell>
              <Typography>{address}</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography>{electors[address].weight}</Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MembersTable;
