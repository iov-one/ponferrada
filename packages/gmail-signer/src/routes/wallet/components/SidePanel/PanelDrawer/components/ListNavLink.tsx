import { Block, ListItem, ListItemText, makeStyles } from "medulas-react-components";
import React from "react";

const useStyles = makeStyles({
  listButton: {
    padding: "8px 24px",
    borderBottom: "1px solid #e0e0e0",
  },
});

interface Props {
  readonly text: string;
  readonly onClick: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined;
}

const ListNavLink = ({ text, onClick }: Props): JSX.Element => {
  const classes = useStyles();
  const listItemClasses = {
    button: classes.listButton,
  };

  return (
    <ListItem button key={text} onClick={onClick} classes={listItemClasses}>
      <Block width="100%" display="flex" alignItems="center" justifyContent="space-between">
        <ListItemText primary={text} />
      </Block>
    </ListItem>
  );
};

export default ListNavLink;
