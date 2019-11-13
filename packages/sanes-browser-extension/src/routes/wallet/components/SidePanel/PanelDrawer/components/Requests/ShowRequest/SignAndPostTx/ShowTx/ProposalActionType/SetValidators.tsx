import { SetValidatorsAction, ValidatorProperties } from "@iov/bns";
import { ListItem, ListItemText } from "medulas-react-components";
import * as React from "react";
import { ellipsifyMiddle } from "ui-logic";

import { txListItemSecondaryProps, useTxListItemHeaderStyles, useTxListItemStyles } from "../TransactionFee";

interface ValidatorProps {
  readonly index: string;
  readonly properties: ValidatorProperties;
}

function ValidatorsListItem({ index, properties }: ValidatorProps): JSX.Element {
  const listItemClasses = useTxListItemStyles();
  const validatorLabel = ellipsifyMiddle(index.slice(8), 27);

  return (
    <React.Fragment>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary={validatorLabel}
          secondary={`Power: ${properties.power}`}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
    </React.Fragment>
  );
}

interface Props {
  readonly header?: boolean;
  readonly action: SetValidatorsAction;
}
function SetValidators({ action, header }: Props): JSX.Element {
  const listItemClasses = useTxListItemStyles();
  const listItemHeaderClasses = useTxListItemHeaderStyles();

  return (
    <React.Fragment>
      {header && (
        <ListItem>
          <ListItemText classes={listItemHeaderClasses} primary="Set Validators" />
        </ListItem>
      )}
      <ListItem>
        <ListItemText classes={listItemClasses} primary="Validators" />
      </ListItem>
      {Object.entries(action.validatorUpdates).map(([key, props]) => (
        <ValidatorsListItem key={key} index={key} properties={props} />
      ))}
    </React.Fragment>
  );
}

export default SetValidators;
