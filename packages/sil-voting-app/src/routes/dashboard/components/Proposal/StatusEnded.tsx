import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

import { VoteResult } from '.';

interface Props {
  readonly expiryDate: Date;
  readonly quorum: number;
  readonly result: VoteResult;
}

interface VoteWinner {
  readonly vote: string;
  readonly percentage: number;
}

const getTotalVotes = (result: VoteResult): number => {
  return result.yes + result.no + result.abstain;
};

const getWinner = (result: VoteResult): VoteWinner => {
  const maxVotes = Math.max(result.yes, result.no);
  let vote = 'Abstain';

  if (maxVotes === result.yes) vote = 'Yes';
  if (maxVotes === result.no) vote = 'No';
  if (maxVotes === 0) vote = 'Abstain';

  const percentage = Math.floor((maxVotes / getTotalVotes(result)) * 100);

  return { vote, percentage };
};

const StatusEnded = (props: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Block display="flex" alignItems="center" marginBottom={1}>
        <Typography variant="body1" weight="semibold">
          Expired on {props.expiryDate.toLocaleDateString('es-ES')}
        </Typography>
        <React.Fragment>
          <Block marginLeft={2}>
            <Typography variant="body1" weight="semibold">
              Quorum: {props.quorum}
            </Typography>
          </Block>
          <Block marginLeft={2}>
            <Typography variant="body1" weight="semibold">
              Total votes: {getTotalVotes(props.result)}
            </Typography>
          </Block>
          <Block marginLeft={2}>
            <Typography variant="body1" weight="semibold">
              Result: {getWinner(props.result).vote}
            </Typography>
          </Block>
        </React.Fragment>
      </Block>
      <Block width="100%" border="1px solid #979797" borderRadius="16px">
        <Block
          padding={1}
          bgcolor="#d8d8d8"
          borderRadius="16px"
          width={getWinner(props.result).percentage + '%'}
        >
          <Typography variant="body1">
            {getWinner(props.result).percentage + '%'} {getWinner(props.result).vote}
          </Typography>
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default StatusEnded;
