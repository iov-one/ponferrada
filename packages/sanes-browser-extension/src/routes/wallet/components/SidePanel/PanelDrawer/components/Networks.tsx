import { Block, Image, List, ListItem, ListItemText, makeStyles } from "medulas-react-components";
import React, { useEffect, useState } from "react";

import { getConfigurationFile } from "../../../../../../extension/background/model/persona/config";
import bulletPoint from "../../../../assets/bulletPoint.svg";

type NetworkData = { name: string; url: string };

const getNetworksData = async (): Promise<NetworkData[]> => {
  const networksData: NetworkData[] = [];

  const chains = (await getConfigurationFile()).chains;
  chains.forEach(chain => networksData.push({ name: chain.chainSpec.name, url: chain.chainSpec.node }));

  return networksData;
};

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
  const [networksData, setNetworksData] = useState<NetworkData[]>([]);

  const classes = useStyles();
  const listClasses = {
    root: classes.listRoot,
  };
  const listItemClasses = {
    root: classes.listItem,
  };

  useEffect(() => {
    let isSubscribed = true;
    async function updateNetworks(): Promise<void> {
      const networksData = await getNetworksData();

      if (isSubscribed) {
        setNetworksData(networksData);
      }
    }
    updateNetworks();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <Block width="100%">
      <List classes={listClasses}>
        {networksData.map(network => (
          <ListItem key={network.name} classes={listItemClasses}>
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
