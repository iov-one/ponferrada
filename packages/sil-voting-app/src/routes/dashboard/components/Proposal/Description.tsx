import Collapse from "@material-ui/core/Collapse";
import Block from "medulas-react-components/lib/components/Block";
import Typography from "medulas-react-components/lib/components/Typography";
import React, { useState } from "react";

import { elipsify } from "../../../../utils/strings";

const DESC_MAX_LENGTH = 180;

interface Props {
  readonly description: string;
}

const Description = ({ description }: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  const onClick = (): void => {
    setExpanded(prevExpanded => !prevExpanded);
  };

  const ReadMore = (): JSX.Element => {
    const shortDescription = elipsify(description, DESC_MAX_LENGTH) + " ";

    return (
      <Block marginTop={2}>
        <Typography inline variant="body2">
          {shortDescription}
        </Typography>
        <Typography inline link onClick={onClick} variant="body2" weight="semibold">
          Read more
        </Typography>
      </Block>
    );
  };

  const hasSmallDescription = description.length < DESC_MAX_LENGTH;

  if (hasSmallDescription) {
    return (
      <Block marginTop={2}>
        <Typography variant="body2">{description}</Typography>
      </Block>
    );
  }

  return (
    <Block marginTop={2}>
      {!expanded && <ReadMore />}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Typography inline variant="body2">
          {description}{" "}
        </Typography>
        <Typography inline link onClick={onClick} variant="body2" weight="semibold">
          Read less
        </Typography>
      </Collapse>
    </Block>
  );
};

export default Description;
