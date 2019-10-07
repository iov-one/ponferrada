import * as React from "react";

import Block from "../../components/Block";
import Typography from "../../components/Typography";

interface Props {
  readonly text: string;
}

const SubtitleSection = ({ text }: Props): JSX.Element => (
  <Block marginTop={2} marginBottom={4}>
    <Typography variant="h6" weight="light" color="textPrimary">
      {text}
    </Typography>
  </Block>
);

export default SubtitleSection;
