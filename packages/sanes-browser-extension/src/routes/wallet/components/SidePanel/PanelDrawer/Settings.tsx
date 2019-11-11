import { Block, Image, List, ListItem, ListItemText, makeStyles } from "medulas-react-components";
import React from "react";

import greenRightChevron from "../../../assets/chevronRightGreen.svg";
import { Views } from ".";

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

const Settings = ({ updateCurrentView }: Props): JSX.Element => {
  const classes = useStyles();
  const listClasses = {
    root: classes.listRoot,
  };
  const listItemClasses = {
    button: classes.listButton,
  };

  const goToNetworks = (): void => updateCurrentView(Views.Networks);
  const goToAbout = (): void => updateCurrentView(Views.About);
  const goToRecoveryWords = (): void => updateCurrentView(Views.RecoveryWords);
  const goToDeleteWallet = (): void => updateCurrentView(Views.DeleteWallet);

  return (
    <Block width="100%">
      <List component="nav" classes={listClasses}>
        <ListItem button key={Views.Networks} onClick={goToNetworks} classes={listItemClasses}>
          <Block width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <ListItemText primary={Views.Networks} />
            <Image alt="Right Chevron" src={greenRightChevron} />
          </Block>
        </ListItem>
        <ListItem button key={Views.About} onClick={goToAbout} classes={listItemClasses}>
          <Block width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <ListItemText primary={Views.About} />
            <Image alt="Right Chevron" src={greenRightChevron} />
          </Block>
        </ListItem>
        <ListItem button key={Views.RecoveryWords} onClick={goToRecoveryWords} classes={listItemClasses}>
          <Block width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <ListItemText primary={Views.RecoveryWords} />
            <Image alt="Right Chevron" src={greenRightChevron} />
          </Block>
        </ListItem>
        <ListItem button key={Views.DeleteWallet} onClick={goToDeleteWallet} classes={listItemClasses}>
          <Block width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <ListItemText primary={Views.DeleteWallet} />
            <Image alt="Right Chevron" src={greenRightChevron} />
          </Block>
        </ListItem>
      </List>
    </Block>
  );
};

export default Settings;
