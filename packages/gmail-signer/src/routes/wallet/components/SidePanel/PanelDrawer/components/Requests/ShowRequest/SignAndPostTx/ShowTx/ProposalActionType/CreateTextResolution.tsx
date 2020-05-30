import { CreateTextResolutionAction } from "@iov/bns";
import { ListItem, ListItemText } from "medulas-react-components";
import * as React from "react";

import { txListItemSecondaryProps, useTxListItemHeaderStyles, useTxListItemStyles } from "../TransactionFee";

interface Props {
  readonly header?: boolean;
  readonly action: CreateTextResolutionAction;
}

function CreateTextResolution({ action, header }: Props): JSX.Element {
  const listItemClasses = useTxListItemStyles();
  const listItemHeaderClasses = useTxListItemHeaderStyles();

  return (
    <React.Fragment>
      {header && (
        <ListItem>
          <ListItemText classes={listItemHeaderClasses} primary="Create Text Resolution" />
        </ListItem>
      )}
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

export default CreateTextResolution;
