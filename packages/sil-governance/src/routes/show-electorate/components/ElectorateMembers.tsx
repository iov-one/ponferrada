import { Electorate } from "@iov/bns";
import { Block, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  readonly electorate: Electorate;
}

const ElectorateMembers = ({ electorate }: Props): JSX.Element => {
  const MembersTable = (): JSX.Element => (
    <table>
      <thead>
        <tr>
          <th>
            <Typography>Address</Typography>
          </th>
          <th>
            <Typography>Weight</Typography>
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(electorate.electors).map(address => (
          <tr key={address}>
            <td>
              <Typography>{address}</Typography>
            </td>
            <td>
              <Typography>{electorate.electors[address].weight}</Typography>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <Block flexGrow={1} margin={2}>
      <Typography variant="h6">{electorate.title} members:</Typography>
      <MembersTable />
    </Block>
  );
};

export default ElectorateMembers;
