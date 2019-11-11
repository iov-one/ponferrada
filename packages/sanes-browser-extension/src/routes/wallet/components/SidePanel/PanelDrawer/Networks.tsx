import { Block, Image, List, ListItem, ListItemText, makeStyles } from "medulas-react-components";
import React from "react";

import bulletPoint from "../../../assets/bulletPoint.svg";

const useStyles = makeStyles({
  listRoot: {
    border: "none",
  },
  listItem: {
    display: "flex",
    alignItems: "baseline",
    overflowWrap: "break-word",
    padding: "0 20px",
  },
});

const networksData = [
  {
    name: "Ethereum Network",
    url: "https://api.infura.io/v1/jsonrpc/kovan",
  },
  {
    name: "Lisk Network",
    url: "https://api.infura.io/v1/jsonrpc/rinkeby",
  },
];

const Networks = (): JSX.Element => {
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
        {networksData.map(network => (
          <ListItem classes={listItemClasses}>
            <Image alt="Bullet Point" src={bulletPoint} />
            <Block marginLeft={2} />
            <ListItemText primary={network.name} secondary={network.url} />
          </ListItem>
        ))}
      </List>
    </Block>
  );
};

export default Networks;
