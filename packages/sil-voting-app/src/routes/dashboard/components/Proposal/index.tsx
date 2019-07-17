import Block from 'medulas-react-components/lib/components/Block';
import React from 'react';

import CreationData from './CreationData';
import Description from './Description';
import StatusEnded from './StatusEnded';
import StatusPending from './StatusPending';
import Title from './Title';
import VoteActions from './VoteActions';

export interface VoteResult {
  readonly yes: number;
  readonly no: number;
  readonly abstain: number;
}

export interface ProposalProps {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly description: string;
  readonly creationDate: Date;
  readonly expiryDate: Date;
  readonly quorum: number;
  readonly threshold: number;
  readonly result: VoteResult;
  readonly vote: 'Invalid' | 'Yes' | 'No' | 'Abstain';
  readonly status: 'Active' | 'Submitted' | 'Ended';
}

const Proposal = ({
  id,
  title,
  author,
  description,
  creationDate,
  expiryDate,
  quorum,
  result,
  vote,
  status,
}: ProposalProps): JSX.Element => {
  const hasEnded = status === 'Ended';
  const showExpiryDate = !hasEnded;

  return (
    <Block width="100%" display="flex" alignItems="center">
      <Block flexGrow={1} margin={2}>
        <Title title={title} status={status} />
        <CreationData author={author} id={id} creationDate={creationDate} />
        <Description description={description} />
        {showExpiryDate && <StatusPending expiryDate={expiryDate} />}
        {hasEnded && <StatusEnded expiryDate={expiryDate} quorum={quorum} result={result} />}
      </Block>
      <VoteActions vote={vote} />
    </Block>
  );
};

export default Proposal;
