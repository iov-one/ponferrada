import { Block, Typography } from "medulas-react-components";
import React from "react";

interface Props {
  text: string;
}

function BillboardMessage({ text }: Props): JSX.Element {
  return (
    <Block bgcolor="white" padding={2}>
      <Typography variant="h6">{text}</Typography>
    </Block>
  );
}

export default BillboardMessage;
