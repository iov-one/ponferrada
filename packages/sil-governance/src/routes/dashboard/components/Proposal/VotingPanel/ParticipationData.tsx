import { Block, Typography } from "medulas-react-components";
import React from "react";
import { round } from "ui-logic";

import { Tally } from "../../../../../store/proposals";

interface Props {
  readonly quorum: number;
  readonly threshold: number;
  readonly tally: Tally;
}

const ParticipationData = ({ quorum, threshold, tally }: Props): JSX.Element => {
  const participation = round((tally.totalVotes / tally.maxVotes) * 100, 2);

  return (
    <Block>
      <Typography variant="body2">
        Votes needed: {tally.totalVotes} / {quorum}
      </Typography>
      <Typography variant="body2">
        "Yes" needed: {tally.yes} / {threshold}
      </Typography>
      <Typography variant="body2">Participation: {participation}%</Typography>
    </Block>
  );
};

export default ParticipationData;
