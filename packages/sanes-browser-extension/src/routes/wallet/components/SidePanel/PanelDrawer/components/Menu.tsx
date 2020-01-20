import { Block, List, makeStyles } from "medulas-react-components";
import React from "react";

import { Views } from "..";
import { clearPersona } from "../../../../../../utils/chrome";
import { history } from "../../../../../../utils/history";
import { WELCOME_ROUTE } from "../../../../../paths";
import ListNavLink from "./ListNavLink";
import ListNavView from "./ListNavView";

export const logoutText = "Log out";

export const logOut = async (): Promise<void> => {
  await clearPersona();
  history.push(WELCOME_ROUTE);
};

const useStyles = makeStyles({
  listRoot: {
    border: "none",
  },
});

interface Props {
  readonly updateCurrentView: (newView: Views) => void;
}

const Menu = ({ updateCurrentView }: Props): JSX.Element => {
  const classes = useStyles();
  const listClasses = {
    root: classes.listRoot,
  };

  return (
    <Block width="100%">
      <List component="nav" classes={listClasses}>
        <ListNavView view={Views.Requests} updateCurrentView={updateCurrentView} />
        <ListNavView view={Views.Settings} updateCurrentView={updateCurrentView} />
        <ListNavLink text={logoutText} onClick={logOut} />
      </List>
    </Block>
  );
};

export default Menu;
