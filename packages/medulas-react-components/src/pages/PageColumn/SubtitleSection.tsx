import * as React from "react";

import Block from "../../components/Block";
import Typography from "../../components/Typography";

interface Props {
  readonly children: string;
}

const SubtitleSection = ({ children }: Props): JSX.Element => (
  <Block marginTop={2} marginBottom={4}>
    <Typography variant="h6" weight="light" color="textPrimary">
      {children}
    </Typography>
  </Block>
);

export default SubtitleSection;
