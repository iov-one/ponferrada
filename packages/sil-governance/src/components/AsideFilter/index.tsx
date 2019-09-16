import { Drawer, List, ListItem, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Block, Image, Typography } from "medulas-react-components";
import React from "react";

import addIcon from "../../assets/add.svg";
import { history } from "../../routes";
import {
  CREATE_PROPOSAL_ROUTE,
  DASHBOARD_ACTIVE_ROUTE,
  DASHBOARD_ENDED_ROUTE,
  DASHBOARD_ROUTE,
  DASHBOARD_SUBMITTED_ROUTE,
} from "../../routes/paths";

export const ASIDE_FILTER_HTML_ID = "aside-filter";
const ADD_PROPOSAL_LABEL = "Add New Proposal";

const useStyles = makeStyles({
  drawerPaper: {
    position: "relative",
    border: "none",
  },
  list: {
    border: "none",
  },
  activeFilter: {
    backgroundColor: "#d8d8d8",
  },
  addProposal: {
    cursor: "pointer",
  },
  addIcon: {
    height: "26px",
  },
});

const navigateTo = (target: string): void => {
  if (history.location.pathname !== target) {
    history.push(target);
  }
};

export enum ElectionFilter {
  All = "All Elections",
  Active = "Active Elections",
  Submitted = "Submitted Elections",
  Ended = "Ended Elections",
}

const menuItems: readonly ElectionFilter[] = [
  ElectionFilter.All,
  ElectionFilter.Active,
  ElectionFilter.Submitted,
  ElectionFilter.Ended,
];

interface Props {
  readonly filter: ElectionFilter | null;
}

const AsideFilter = ({ filter }: Props): JSX.Element => {
  const classes = useStyles();

  const paperClasses = {
    paper: classes.drawerPaper,
  };
  const listClasses = {
    root: classes.list,
  };
  const filterClasses = {
    root: classes.activeFilter,
  };

  const menuItemToTarget = (filter: ElectionFilter): string => {
    switch (filter) {
      case ElectionFilter.Active:
        return DASHBOARD_ACTIVE_ROUTE;
      case ElectionFilter.Submitted:
        return DASHBOARD_SUBMITTED_ROUTE;
      case ElectionFilter.Ended:
        return DASHBOARD_ENDED_ROUTE;
      default:
        return DASHBOARD_ROUTE;
    }
  };

  return (
    <Block id={ASIDE_FILTER_HTML_ID} minWidth="205px">
      <Drawer variant="permanent" classes={paperClasses}>
        <List classes={listClasses}>
          {menuItems.map(text => (
            <ListItem
              button
              key={text}
              classes={filter === text ? filterClasses : undefined}
              onClick={() => navigateTo(menuItemToTarget(text))}
            >
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Block
        display="flex"
        alignItems="center"
        justifyContent="center"
        paddingTop={1}
        paddingBottom={1}
        className={classes.addProposal}
        onClick={() => navigateTo(CREATE_PROPOSAL_ROUTE)}
      >
        <Image alt="Add Proposal" src={addIcon} className={classes.addIcon} />
        <Block marginLeft={1}>
          <Typography>{ADD_PROPOSAL_LABEL}</Typography>
        </Block>
      </Block>
    </Block>
  );
};

export default AsideFilter;
