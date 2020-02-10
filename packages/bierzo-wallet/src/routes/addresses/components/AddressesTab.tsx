import { makeStyles, Theme } from "@material-ui/core";
import classNames from "classnames";
import { Block, Typography } from "medulas-react-components";
import React from "react";

import { AddressesTableProps } from "../../../components/AddressesTable";
import Iovnames, { IovnamesProps } from "./Iovnames";
import Starnames, { StarnamesProps } from "./Starnames";
import UserAddresses from "./UserAddresses";

export const yourStarnames = "Your starnames";
export const yourIovnames = "Your iovnames";
export const yourAddresses = "Your blockchain addresses";

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    margin: `0px ${theme.spacing(4)}px`,
    "&:hover": {
      cursor: "pointer",
    },
  },
  activated: {
    "& $line": {
      visibility: "visible",
    },
  },
  line: {
    visibility: "hidden",
    height: "4px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "4px",
    marginTop: "4px",
  },
}));

interface TabItemProps {
  readonly children: string;
  readonly selected: boolean;
  readonly onChangeTab: () => void;
}
function TabItem({ children, selected, onChangeTab }: TabItemProps): JSX.Element {
  const classes = useStyles();
  const balanceClasses = classNames(classes.item, { [classes.activated]: selected });

  return (
    <Block marginRight={4}>
      <Block className={balanceClasses} onClick={onChangeTab}>
        <Typography variant="subtitle2" weight="semibold">
          {children}
        </Typography>
        <Block className={classes.line} />
      </Block>
    </Block>
  );
}

function AddressesTab({
  chainAddresses,
  usernames,
  starnames,
  onRegisterUsername,
  onRegisterStarname,
  rpcEndpointType,
}: AddressesTableProps & IovnamesProps & StarnamesProps): JSX.Element {
  const [selectedTab, setSelectedTab] = React.useState<"starnames" | "iovnames" | "addresses">("starnames");

  const changeTabToStarnames = (): void => setSelectedTab("starnames");
  const changeTabToIovnames = (): void => setSelectedTab("iovnames");
  const changeTabToAddresses = (): void => setSelectedTab("addresses");

  return (
    <Block marginTop={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Block display="flex">
        <TabItem selected={selectedTab === "starnames"} onChangeTab={changeTabToStarnames}>
          {yourStarnames}
        </TabItem>
        <TabItem selected={selectedTab === "iovnames"} onChangeTab={changeTabToIovnames}>
          {yourIovnames}
        </TabItem>
        <TabItem selected={selectedTab === "addresses"} onChangeTab={changeTabToAddresses}>
          {yourAddresses}
        </TabItem>
      </Block>
      {selectedTab === "starnames" && (
        <Starnames
          starnames={starnames}
          onRegisterStarname={onRegisterStarname}
          rpcEndpointType={rpcEndpointType}
        />
      )}
      {selectedTab === "iovnames" && (
        <Iovnames
          usernames={usernames}
          onRegisterUsername={onRegisterUsername}
          rpcEndpointType={rpcEndpointType}
        />
      )}
      {selectedTab === "addresses" && <UserAddresses chainAddresses={chainAddresses} />}
    </Block>
  );
}

export default AddressesTab;
