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

const Proposal = (props: ProposalProps): JSX.Element => {
  return (
    <Block width="100%" display="flex" alignItems="center">
      <Block flexGrow={1} margin={2}>
        <Title title={props.title} status={props.status} />
        <CreationData author={props.author} id={props.id} creationDate={props.creationDate} />
        <Description description={props.description} />

        {props.status !== 'Ended' && <StatusPending expiryDate={props.expiryDate} />}

        {props.status === 'Ended' && (
          <StatusEnded expiryDate={props.expiryDate} quorum={props.quorum} result={props.result} />
        )}
      </Block>
      <VoteActions vote={props.vote} />
    </Block>
  );
};

export default Proposal;
