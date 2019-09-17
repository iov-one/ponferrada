import { CreateTextResolutionAction } from "@iov/bns";
import { ListItem, ListItemText } from "medulas-react-components";
import * as React from "react";

import { txListItemSecondaryProps, useTxListItemStyles } from "../ShowRequest/TransactionFee";

interface Props {
  readonly action: CreateTextResolutionAction;
}

function CreateTextResolutionActionType({ action }: Props): JSX.Element {
  const listItemClasses = useTxListItemStyles();

  return (
    <React.Fragment>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Resolution"
          secondary={action.resolution}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
    </React.Fragment>
  );
}

export default CreateTextResolutionActionType;
