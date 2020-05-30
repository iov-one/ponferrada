import { Block, Link, List, makeStyles, Typography } from "medulas-react-components";
import React from "react";

import { Views } from "..";
import { TERMS_URL } from "../../../../../paths";
import ListNavView from "./ListNavView";

const useStyles = makeStyles({
  listRoot: {
    border: "none",
  },
});

interface Props {
  readonly updateCurrentView: (newView: Views) => void;
}

const Settings = ({ updateCurrentView }: Props): JSX.Element => {
  const classes = useStyles();
  const listClasses = {
    root: classes.listRoot,
  };

  return (
    <Block width="100%">
      <List component="nav" classes={listClasses}>
        <ListNavView view={Views.Networks} updateCurrentView={updateCurrentView} />
        <ListNavView view={Views.About} updateCurrentView={updateCurrentView} />
        <ListNavView view={Views.RecoveryWords} updateCurrentView={updateCurrentView} />
        <ListNavView view={Views.DeleteWallet} updateCurrentView={updateCurrentView} />
      </List>
      <Block marginTop={8} display="flex" justifyContent="center">
        <Link to={TERMS_URL}>
          <Typography variant="subtitle2" color="primary" link>
            Terms & Conditions
          </Typography>
        </Link>
      </Block>
    </Block>
  );
};

export default Settings;
