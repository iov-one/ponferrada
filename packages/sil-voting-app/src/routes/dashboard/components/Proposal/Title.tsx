import { Block, Typography } from "medulas-react-components";
import React from "react";

import { elipsify } from "../../../../utils/strings";

const TITLE_MAX_LENGTH = 30;

interface Props {
  readonly title: string;
}

const Title = ({ title }: Props): JSX.Element => {
  const shortTitle = elipsify(title, TITLE_MAX_LENGTH);

  return (
    <Block display="flex" alignItems="center">
      <Typography variant="h6">{shortTitle}</Typography>
    </Block>
  );
};

export default Title;
