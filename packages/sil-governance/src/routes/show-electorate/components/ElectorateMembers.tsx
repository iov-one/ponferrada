import { Electorate } from "@iov/bns";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Block, Typography } from "medulas-react-components";
import React, { useMemo } from "react";

interface Props {
  readonly electorate: Electorate;
}

const ElectorateMembers = ({ electorate }: Props): JSX.Element => {
  const MembersTable = useMemo(
    () => (): JSX.Element => (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell align="right">Weight</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(electorate.electors).map(address => (
            <TableRow key={address}>
              <TableCell>
                <Typography>{address}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography>{electorate.electors[address].weight}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ),
    [electorate.electors],
  );

  return (
    <Block flexGrow={1} margin={2}>
      <Typography variant="h6">{electorate.title} members:</Typography>
      <MembersTable />
    </Block>
  );
};

export default ElectorateMembers;
