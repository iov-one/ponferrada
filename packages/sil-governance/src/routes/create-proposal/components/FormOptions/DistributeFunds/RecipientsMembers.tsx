import { Collapse, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Block, Typography } from "medulas-react-components";
import React, { useMemo, useState } from "react";

import { Recipient } from ".";

interface Props {
  readonly recipients: readonly Recipient[];
}

const RecipientsMembers = ({ recipients }: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  const recipientsField = expanded ? "Hide recipients" : "Show recipients";

  const onClick = (): void => {
    setExpanded(prevExpanded => !prevExpanded);
  };

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
    ),
    [recipients],
  );

  return (
    <Block marginTop={2}>
      <Typography inline link onClick={onClick}>
        {recipientsField}
      </Typography>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <MembersTable />
      </Collapse>
    </Block>
  );
};

export default RecipientsMembers;
