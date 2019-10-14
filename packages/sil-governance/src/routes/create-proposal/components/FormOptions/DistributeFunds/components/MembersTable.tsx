import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Typography } from "medulas-react-components";
import React from "react";

import { Recipient } from "..";

interface Props {
  readonly recipients: readonly Recipient[];
}

const MembersTable = ({ recipients }: Props): JSX.Element => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Address</TableCell>
          <TableCell align="right">Weight</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {recipients.map(recipient => (
          <TableRow key={recipient.address}>
            <TableCell>
              <Typography>{recipient.address}</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography>{recipient.weight}</Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MembersTable;
