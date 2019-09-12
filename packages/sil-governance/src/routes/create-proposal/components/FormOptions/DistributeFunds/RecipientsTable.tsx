import { Collapse } from "@material-ui/core";
import { Block, Typography } from "medulas-react-components";
import React, { useState } from "react";

import { Recipient } from ".";

interface Props {
  readonly recipients: Recipient[];
}

const RecipientsTable = ({ recipients }: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  const RECIPIENTS_FIELD = expanded ? "Hide recipients" : "Show recipients";

  const onClick = (): void => {
    setExpanded(prevExpanded => !prevExpanded);
  };

  const Table = (): JSX.Element => (
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
        {recipients.map(recipient => (
          <tr key={recipient.address}>
            <td>
              <Typography>{recipient.address}</Typography>
            </td>
            <td>
              <Typography>{recipient.weight}</Typography>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <Block marginTop={2}>
      <Typography inline link onClick={onClick}>
        {RECIPIENTS_FIELD}
      </Typography>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Table />
      </Collapse>
    </Block>
  );
};

export default RecipientsTable;
