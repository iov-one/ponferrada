import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

const ParticipationData = (): JSX.Element => {
  return (
    <Block display="flex" justifyContent="space-between">
      <Typography>Quorum: 999</Typography>
      <Typography>Threshold: 999</Typography>
      <Typography>Period: 999</Typography>
    </Block>
  );
};

export default ParticipationData;
