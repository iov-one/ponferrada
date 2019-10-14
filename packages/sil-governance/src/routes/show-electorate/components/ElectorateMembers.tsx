import { Electorate } from "@iov/bns";
import { Block, Typography } from "medulas-react-components";
import React from "react";

import MembersTable from "./MembersTable";

interface Props {
  readonly electorate: Electorate;
}

const ElectorateMembers = ({ electorate }: Props): JSX.Element => {
  return (
    <Block flexGrow={1} margin={2}>
      <Typography variant="h6">{electorate.title} members:</Typography>
      <MembersTable electors={electorate.electors} />
    </Block>
  );
};

export default ElectorateMembers;
