import { ChainId } from "@iov/bcp";
import { Block, Image, List, ListItem, ListItemText, makeStyles, Typography } from "medulas-react-components";
import React, { useContext, useEffect, useState } from "react";

import { Views } from "..";
import { PersonaContext } from "../../../../../../context/PersonaProvider";
import { getChains, getConfigurationFile } from "../../../../../../extension/background/model/persona/config";
import bulletPointGreen from "../../../../assets/bulletPointGreen.svg";
import bulletPointRed from "../../../../assets/bulletPointRed.svg";

const useStyles = makeStyles({
  listRoot: {
    border: "none",
  },
  listItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "baseline",
    overflowWrap: "break-word",
    padding: "0 24px",
  },
});

export interface Network {
  readonly name: string;
  readonly node: string;
  readonly connected: boolean;
  readonly isBNS: boolean;
}

export const getNetworks = async (connectedChains: readonly ChainId[]): Promise<readonly Network[]> => {
  const configuredChains = (await getChains()).map(chain => chain.chainSpec);

  return configuredChains.map(chain => {
    const connected = connectedChains.includes(chain.chainId);
    return {
      name: chain.name,
      node: chain.node,
      isBNS: chain.codecType === "bns",
      connected,
    };
  });
};

interface Props {
  readonly updateCurrentView: (newView: Views) => void;
}

const Networks = ({ updateCurrentView }: Props): JSX.Element => {
  const connectedChains = useContext(PersonaContext).connectedChains;
  const [networks, setNetworks] = useState<readonly Network[]>([]);
  const [isProduction, setProductionState] = useState(true);

  const onChangeNetwork = (): void => updateCurrentView(Views.ChangeNetwork);

  useEffect(() => {
    let isSubscribed = true;

    async function updateNetworks(): Promise<void> {
      const networks = await getNetworks(connectedChains);
      const isProduction = !!(await getConfigurationFile()).production;

      if (isSubscribed) {
        setNetworks(networks);
        setProductionState(isProduction);
      }
    }

    updateNetworks();

    return () => {
      isSubscribed = false;
    };
  }, [connectedChains]);

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
        {networks.map(network => {
          return (
            <ListItem key={network.name} classes={listItemClasses}>
              <Block display="flex">
                <Image alt="Bullet Point" src={network.connected ? bulletPointGreen : bulletPointRed} />
                <Block marginLeft={2} />
                <ListItemText primary={network.name} secondary={network.node} />
              </Block>
              {network.isBNS && !isProduction && (
                <Block display="flex">
                  <Block marginLeft={3} />
                  <Typography link color="primary" variant="body2" onClick={onChangeNetwork}>
                    Change
                  </Typography>
                </Block>
              )}
            </ListItem>
          );
        })}
      </List>
    </Block>
  );
};

export default Networks;
