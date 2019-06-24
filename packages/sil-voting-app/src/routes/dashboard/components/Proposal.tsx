import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

const Proposal = (num: number): JSX.Element => {
  return (
    <Block width="100%">
      <Typography variant="h6">Proposal {num}</Typography>
    </Block>
  );
};

export default Proposal;
