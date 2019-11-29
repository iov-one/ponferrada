import { Block, Image, ListItem, ListItemText, makeStyles } from "medulas-react-components";
import React from "react";

import { Views } from "..";
import greenRightChevron from "../../../../assets/chevronRightGreen.svg";

const useStyles = makeStyles({
  listButton: {
    padding: "8px 24px",
    borderBottom: "1px solid #e0e0e0",
  },
});

interface Props {
  readonly view: Views;
  readonly updateCurrentView: (newView: Views) => void;
}

const ListNavView = ({ view, updateCurrentView }: Props): JSX.Element => {
  const classes = useStyles();
  const listItemClasses = {
    button: classes.listButton,
  };

  const goToView = (): void => updateCurrentView(view);

  return (
    <ListItem button key={view} onClick={goToView} classes={listItemClasses}>
      <Block width="100%" display="flex" alignItems="center" justifyContent="space-between">
        <ListItemText primary={view} />
        <Image alt="Right Chevron" src={greenRightChevron} />
      </Block>
    </ListItem>
  );
};

export default ListNavView;
