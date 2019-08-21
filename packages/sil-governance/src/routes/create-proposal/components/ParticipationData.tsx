import { Block, Typography } from "medulas-react-components";
import React from "react";

const ParticipationData = (): JSX.Element => {
  return (
    <Block display="flex" justifyContent="space-between" marginTop={2}>
      <Typography>Quorum: 999</Typography>
      <Typography>Threshold: 999</Typography>
      <Typography>Period: 999</Typography>
    </Block>
  );
};

export default ParticipationData;
