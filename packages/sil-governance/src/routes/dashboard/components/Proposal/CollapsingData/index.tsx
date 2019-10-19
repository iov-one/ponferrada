import { ProposalAction } from "@iov/bns";
import Collapse from "@material-ui/core/Collapse";
import { Block, Typography } from "medulas-react-components";
import React, { useState } from "react";

import Description from "./Description";
import DisplayOptions from "./DisplayOptions";
import ReadMore from "./ReadMore";

interface Props {
  readonly description: string;
  readonly action: ProposalAction;
}

const CollapsingData = ({ description, action }: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = (): void => {
    setExpanded(prevExpanded => !prevExpanded);
  };

  return (
    <Block marginTop={2}>
      {!expanded && (
        <ReadMore toggleExpanded={toggleExpanded}>
          <Description fullDescription={description} expanded={false} />
        </ReadMore>
      )}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Description fullDescription={description} expanded={expanded} />
        <DisplayOptions action={action} />
        <Typography inline link onClick={toggleExpanded} variant="body2" weight="semibold">
          Read less
        </Typography>
      </Collapse>
    </Block>
  );
};

export default CollapsingData;
