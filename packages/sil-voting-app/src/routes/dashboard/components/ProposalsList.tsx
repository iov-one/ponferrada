import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import React from 'react';
import { randomProps } from '../utils/randomProposal';
import Proposal from './Proposal';

// Random props to test layout before consuming governance API
const props = new Array(10).fill({}).map(() => {
  return randomProps();
});

const ProposalsList = (): JSX.Element => {
  const proposals = props.map((_, index) => {
    if (index === 0) {
      return <React.Fragment key={index}>{Proposal(props[index])}</React.Fragment>;
    }

    return (
      <React.Fragment key={index}>
        <Hairline />
        {Proposal(props[index])}
      </React.Fragment>
    );
  });

  return <Block flexGrow={1}>{proposals}</Block>;
};

export default ProposalsList;
