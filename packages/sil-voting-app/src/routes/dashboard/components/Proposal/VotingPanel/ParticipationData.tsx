import Block from "medulas-react-components/lib/components/Block";
import Typography from "medulas-react-components/lib/components/Typography";
import React from "react";

import { Tally } from "..";

interface Props {
  readonly quorum: number;
  readonly threshold: number;
  readonly tally: Tally;
}

const ParticipationData = ({ quorum, threshold, tally }: Props): JSX.Element => {
  const participation = (tally.totalVotes / tally.maxVotes) * 100;

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
