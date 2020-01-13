import { Block, Image, List, ListItem, ListItemText, makeStyles } from "medulas-react-components";
import React, { useContext } from "react";

import { PersonaContext } from "../../../../../../context/PersonaProvider";
import bulletPointGreen from "../../../../assets/bulletPointGreen.svg";
import bulletPointRed from "../../../../assets/bulletPointRed.svg";

const useStyles = makeStyles({
  listRoot: {
    border: "none",
  },
  listItem: {
    display: "flex",
    alignItems: "baseline",
    overflowWrap: "break-word",
    padding: "0 24px",
  },
});

const Networks = (): JSX.Element => {
  const networks = useContext(PersonaContext).chainStatuses;

  const classes = useStyles();
  const listClasses = {
    root: classes.listRoot,
  };
  const listItemClasses = {
    root: classes.listItem,
  };

  return (
    <Block width="100%">
      <List classes={listClasses}>
        {networks.map(network => (
          <ListItem key={network.name} classes={listItemClasses}>
            <Image alt="Bullet Point" src={network.connected ? bulletPointGreen : bulletPointRed} />
            <Block marginLeft={2} />
            <ListItemText primary={network.name} secondary={network.node} />
          </ListItem>
        ))}
      </List>
    </Block>
  );
};

export default Networks;
