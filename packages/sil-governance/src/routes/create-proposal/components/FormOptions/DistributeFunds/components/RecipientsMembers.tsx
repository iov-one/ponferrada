import { Collapse } from "@material-ui/core";
import { Block, Typography } from "medulas-react-components";
import React, { useState } from "react";

import { Recipient } from "..";
import MembersTable from "./MembersTable";

interface Props {
  readonly recipients: readonly Recipient[];
}

const RecipientsMembers = ({ recipients }: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  const recipientsField = expanded ? "Hide recipients" : "Show recipients";

  const onClick = (): void => {
    setExpanded(prevExpanded => !prevExpanded);
  };

  return (
    <Block marginTop={2}>
      <Typography inline link onClick={onClick}>
        {recipientsField}
      </Typography>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <MembersTable recipients={recipients} />
      </Collapse>
    </Block>
  );
};

export default RecipientsMembers;
