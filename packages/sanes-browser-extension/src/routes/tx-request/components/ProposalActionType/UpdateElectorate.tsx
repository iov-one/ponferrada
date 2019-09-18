import { ElectorProperties, UpdateElectorateAction } from "@iov/bns";
import { ListItem, ListItemText } from "medulas-react-components";
import * as React from "react";

import {
  txListItemSecondaryProps,
  useTxListItemHeaderStyles,
  useTxListItemStyles,
} from "../ShowRequest/TransactionFee";

interface ValidatorProps {
  readonly elector: string;
  readonly properties: ElectorProperties;
}

function ElectorListItem({ elector, properties }: ValidatorProps): JSX.Element {
  const listItemClasses = useTxListItemStyles();
  const electorLabel = `${elector.slice(0, 20)}...${elector.slice(-3)}`;

  return (
    <React.Fragment>
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary={electorLabel}
          secondary={`Weight: ${properties.weight}`}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
    </React.Fragment>
  );
}

interface Props {
  readonly header?: boolean;
  readonly action: UpdateElectorateAction;
}
function UpdateElectorate({ action, header }: Props): JSX.Element {
  const listItemClasses = useTxListItemStyles();
  const listItemHeaderClasses = useTxListItemHeaderStyles();

  return (
    <React.Fragment>
      {header && (
        <ListItem>
          <ListItemText classes={listItemHeaderClasses} primary="Update Electorate" />
        </ListItem>
      )}
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Electorate ID"
          secondary={action.electorateId}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
      <ListItem>
        <ListItemText classes={listItemClasses} primary="Electors" />
      </ListItem>
      {Object.entries(action.diffElectors).map(([key, props]) => (
        <ElectorListItem key={key} elector={key} properties={props} />
      ))}
    </React.Fragment>
  );
}

export default UpdateElectorate;
