import { Typography } from "medulas-react-components";
import React from "react";
import { ellipsify } from "ui-logic";

const DESC_MAX_LENGTH = 180;

interface Props {
  readonly fullDescription: string;
  readonly expanded: boolean;
}

const Description = ({ fullDescription, expanded }: Props): JSX.Element => {
  const description = expanded ? fullDescription : ellipsify(fullDescription, DESC_MAX_LENGTH) + " ";

  return (
    <Typography inline variant="body2">
      {description}
    </Typography>
  );
};

export default Description;
