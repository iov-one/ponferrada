import { Block, Typography } from "medulas-react-components";
import * as React from "react";

interface Props {
  readonly children: string;
}

const SubtitleSection = ({ children }: Props): JSX.Element => (
  <Block marginTop={2} marginBottom={4}>
    <Typography variant="h6" weight="light" color="textPrimary"></Typography>
  </Block>
);

export default SubtitleSection;
