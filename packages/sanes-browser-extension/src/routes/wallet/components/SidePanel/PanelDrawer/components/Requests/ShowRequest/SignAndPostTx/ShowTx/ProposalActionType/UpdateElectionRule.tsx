import { Fraction, UpdateElectionRuleAction } from "@iov/bns";
import { ListItem, ListItemText } from "medulas-react-components";
import * as React from "react";
import { displayPeriod } from "ui-logic";

import { txListItemSecondaryProps, useTxListItemHeaderStyles, useTxListItemStyles } from "../TransactionFee";

const displayfraction = (fraction: Fraction): string => `${fraction.numerator}/${fraction.denominator}`;

interface Props {
  readonly header?: boolean;
  readonly action: UpdateElectionRuleAction;
}

function UpdateElectionRule({ action, header }: Props): JSX.Element {
  const listItemClasses = useTxListItemStyles();
  const listItemHeaderClasses = useTxListItemHeaderStyles();

  return (
    <React.Fragment>
      {header && (
        <ListItem>
          <ListItemText classes={listItemHeaderClasses} primary="Update Election Rule" />
        </ListItem>
      )}
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Updates committee"
          secondary={action.electionRuleId}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
      {action.quorum && (
        <ListItem>
          <ListItemText
            classes={listItemClasses}
            primary="Quorum"
            secondary={displayfraction(action.quorum)}
            secondaryTypographyProps={txListItemSecondaryProps}
          />
        </ListItem>
      )}
      {action.threshold && (
        <ListItem>
          <ListItemText
            classes={listItemClasses}
            primary="Threshold"
            secondary={displayfraction(action.threshold)}
            secondaryTypographyProps={txListItemSecondaryProps}
          />
        </ListItem>
      )}
      <ListItem>
        <ListItemText
          classes={listItemClasses}
          primary="Period"
          secondary={displayPeriod(action.votingPeriod)}
          secondaryTypographyProps={txListItemSecondaryProps}
        />
      </ListItem>
    </React.Fragment>
  );
}

export default UpdateElectionRule;
