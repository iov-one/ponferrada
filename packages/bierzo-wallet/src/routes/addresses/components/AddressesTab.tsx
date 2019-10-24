import { makeStyles, Theme } from "@material-ui/core";
import classNames from "classnames";
import { Block, Typography } from "medulas-react-components";
import React from "react";

import { AddressesTableProps } from "../../../components/AddressesTable";
import UserAddresses from "./UserAddresses";

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

function AddressesTab({ chainAddresses }: AddressesTableProps): JSX.Element {
  const [selectedTab, setSelectedTab] = React.useState<"starnames" | "addresses">("starnames");

  const changeTabToAddresses = (): void => setSelectedTab("addresses");
  const changeTabToStarnames = (): void => setSelectedTab("starnames");

  return (
    <Block marginTop={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Block display="flex">
        <TabItem selected={selectedTab === "starnames"} onChangeTab={changeTabToStarnames}>
          Your starnames
        </TabItem>
        <TabItem selected={selectedTab === "addresses"} onChangeTab={changeTabToAddresses}>
          Your blockchain address
        </TabItem>
      </Block>
      {selectedTab === "addresses" && <UserAddresses chainAddresses={chainAddresses} />}
    </Block>
  );
}

export default AddressesTab;