import { ProposalAction } from "@iov/bns";
import Collapse from "@material-ui/core/Collapse";
import { Block, Typography } from "medulas-react-components";
import React, { useState } from "react";

import Description from "./Description";
import DisplayOptions from "./DisplayOptions";

interface Props {
  readonly description: string;
  readonly action: ProposalAction;
}

const CollapsingData = ({ description, action }: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  const onClick = (): void => {
    setExpanded(prevExpanded => !prevExpanded);
  };

  const ReadMore = (): JSX.Element => {
    return (
      <Block marginTop={2}>
        <Description fullDescription={description} expanded={expanded} />
        <Typography inline link onClick={onClick} variant="body2" weight="semibold">
          Read more
        </Typography>
      </Block>
    );
  };

  return (
    <Block marginTop={2}>
      {!expanded && <ReadMore />}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Description fullDescription={description} expanded={expanded} />
        <DisplayOptions action={action} />
        <Typography inline link onClick={onClick} variant="body2" weight="semibold">
          Read less
        </Typography>
      </Collapse>
    </Block>
  );
};

export default CollapsingData;
