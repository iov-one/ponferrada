import { Block, Typography } from "medulas-react-components";
import React from "react";

function BillboardMessage(): JSX.Element {
  return (
    <Block bgcolor="white" padding={2}>
      <Typography variant="h6">Please interact with NEUMA extension before continue.</Typography>
    </Block>
  );
}

export default BillboardMessage;
