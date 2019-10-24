import { Block, Typography } from "medulas-react-components";
import React from "react";

interface TabItemProps {
  readonly children: string;
}
function TabItem({ children }: TabItemProps): JSX.Element {
  return (
    <Block marginRight={4}>
      <Typography variant="subtitle2" inline weight="semibold">
        {children}
      </Typography>
    </Block>
  );
}

const AddressesTab = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = React.useState<"starnames" | "addresses">("starnames");

  return (
    <Block marginTop={4} display="flex" alignContent="center" justifyContent="center">
      <TabItem>Your starnames</TabItem>
      <TabItem>Your blockchain address</TabItem>
    </Block>
  );
};

export default AddressesTab;
