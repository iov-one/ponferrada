import { SetValidatorsAction, ValidatorProperties } from "@iov/bns";
import { ListItem, ListItemText } from "medulas-react-components";
import * as React from "react";

import { txListItemSecondaryProps, useTxListItemStyles } from "../ShowRequest/TransactionFee";

interface ValidatorProps {
  readonly index: string;
  readonly properties: ValidatorProperties;
}

function ValidatorsListItem({ index, properties }: ValidatorProps): JSX.Element {
  const listItemClasses = useTxListItemStyles();
  const validatorLabel = `${index.slice(8, 28)}...${index.slice(-3)}`;

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
  readonly action: SetValidatorsAction;
}
function ReleaseEscrow({ action }: Props): JSX.Element {
  const listItemClasses = useTxListItemStyles();

  return (
    <React.Fragment>
      <ListItem>
        <ListItemText classes={listItemClasses} primary="Validators" />
      </ListItem>
      {Object.keys(action.validatorUpdates).map(key => (
        <ValidatorsListItem key={key} index={key} properties={action.validatorUpdates[key]} />
      ))}
    </React.Fragment>
  );
}

export default ReleaseEscrow;
