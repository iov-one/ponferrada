import { Block, Image, List, ListItem, ListItemText, makeStyles } from "medulas-react-components";
import React from "react";

import { clearPersona } from "../../../../../utils/chrome";
import { history } from "../../../../../utils/history";
import { WELCOME_ROUTE } from "../../../../paths";
import greenRightChevron from "../../../assets/chevronRightGreen.svg";
import { Views } from ".";

const requestsText = "Requests";
const settingsText = "Settings";
const logoutText = "Log out";

const useStyles = makeStyles({
  listRoot: {
    border: "none",
  },
  listButton: {
    borderBottom: "1px solid #e0e0e0",
  },
});

interface Props {
  updateCurrentView: (newView: Views) => void;
}

const Menu = ({ updateCurrentView }: Props): JSX.Element => {
  const classes = useStyles();
  const listClasses = {
    root: classes.listRoot,
  };
  const listItemClasses = {
    button: classes.listButton,
  };

  const goToRequests = (): void => updateCurrentView(Views.Requests);
  const goToSettings = (): void => updateCurrentView(Views.Settings);
  const logOut = async (): Promise<void> => {
    await clearPersona();
    history.push(WELCOME_ROUTE);
  };

  return (
    <Block width="100%">
      <List component="nav" classes={listClasses}>
        <ListItem button key={requestsText} onClick={goToRequests} classes={listItemClasses}>
          <Block width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <ListItemText primary={requestsText} />
            <Image alt="Right Chevron" src={greenRightChevron} />
          </Block>
        </ListItem>
        <ListItem button key={settingsText} onClick={goToSettings} classes={listItemClasses}>
          <Block width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <ListItemText primary={settingsText} />
            <Image alt="Right Chevron" src={greenRightChevron} />
          </Block>
        </ListItem>
        <ListItem button key={logoutText} onClick={logOut} classes={listItemClasses}>
          <Block width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <ListItemText primary={logoutText} />
          </Block>
        </ListItem>
      </List>
    </Block>
  );
};

export default Menu;
