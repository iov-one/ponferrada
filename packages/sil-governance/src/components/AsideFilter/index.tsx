import { Drawer, List, ListItem, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Block, Image, Typography } from "medulas-react-components";
import React, { useState } from "react";

import addIcon from "../../assets/add.svg";
import { history } from "../../routes";
import { CREATE_PROPOSAL_ROUTE } from "../../routes/paths";

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

const addNewProposal = (): void => {
  if (history.location.pathname !== CREATE_PROPOSAL_ROUTE) {
    history.push(CREATE_PROPOSAL_ROUTE);
  }
};

export enum ElectionFilter {
  All = "All Elections",
  Active = "Active Elections",
  Submitted = "Submitted Elections",
  Ended = "Ended Elections",
}

interface Props {
  readonly filter: ElectionFilter | null;
  readonly onChangeFilter: (filter: ElectionFilter) => void;
}

const AsideFilter = ({ filter, onChangeFilter }: Props): JSX.Element => {
  const classes = useStyles();
  const [activeFilter, setActiveFilter] = useState(filter);

  const paperClasses = {
    paper: classes.drawerPaper,
  };
  const listClasses = {
    root: classes.list,
  };
  const filterClasses = {
    root: classes.activeFilter,
  };

  const updateActiveFilter = (text: string): void => {
    let filter;

    switch (text) {
      case ElectionFilter.Active:
        filter = ElectionFilter.Active;
        break;
      case ElectionFilter.Submitted:
        filter = ElectionFilter.Submitted;
        break;
      case ElectionFilter.Ended:
        filter = ElectionFilter.Ended;
        break;
      default:
        filter = ElectionFilter.All;
    }

    setActiveFilter(filter);
    onChangeFilter(filter);
  };

  return (
    <Block id={ASIDE_FILTER_HTML_ID} minWidth="205px">
      <Drawer variant="permanent" classes={paperClasses}>
        <List classes={listClasses}>
          {Object.values(ElectionFilter).map(text => (
            <ListItem
              button
              key={text}
              classes={activeFilter === text ? filterClasses : undefined}
              onClick={() => updateActiveFilter(text)}
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
        marginTop={1}
        className={classes.addProposal}
        onClick={addNewProposal}
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
