import { Block, Image, Typography } from "medulas-react-components";
import * as React from "react";

interface Props {
  readonly icon: string;
  readonly text: string;
}

const CollectibleItem = ({ icon, text }: Props): JSX.Element => {
  return (
    <Block
      display="flex"
      alignItems="center"
      paddingTop={2}
      paddingBottom={2}
      paddingLeft={3}
      paddingRight={3}
    >
      <Image alt={`${text} Icon`} src={icon} height="40px" />
      <Block marginLeft={2}>
        <Typography variant="body2">{text}</Typography>
      </Block>
    </Block>
  );
};

export default CollectibleItem;
