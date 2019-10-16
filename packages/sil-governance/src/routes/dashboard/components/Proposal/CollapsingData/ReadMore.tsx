import { Block, Typography } from "medulas-react-components";
import React from "react";

import Description from "./Description";

interface Props {
  readonly description: string;
  readonly toggleExpanded: () => void;
}

const ReadMore = ({ description, toggleExpanded }: Props): JSX.Element => {
  return (
    <Block marginTop={2}>
      <Description fullDescription={description} expanded={false} />
      <Typography inline link onClick={toggleExpanded} variant="body2" weight="semibold">
        Read more
      </Typography>
    </Block>
  );
};

export default ReadMore;
