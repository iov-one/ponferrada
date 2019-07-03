import Block from 'medulas-react-components/lib/components/Block';
import Img from 'medulas-react-components/lib/components/Image';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';
import { VoteResult } from '.';
import deleteIcon from '../../../../assets/delete.svg';

interface Props {
  readonly expiryDate: Date;
  readonly quorum: number;
  readonly result: VoteResult;
  readonly status: 'Active' | 'Submitted' | 'Ended';
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

const Status = (props: Props): JSX.Element => {
  return (
    <React.Fragment>
      <Block display="flex" alignItems="center">
        {props.status !== 'Ended' && (
          <Typography variant="body1" weight="semibold">
            Expires on {props.expiryDate.toLocaleDateString('es-ES')}
          </Typography>
        )}
        {props.status === 'Ended' && (
          <Typography variant="body1" weight="semibold">
            Expired on {props.expiryDate.toLocaleDateString('es-ES')}
          </Typography>
        )}
        {props.status !== 'Ended' && (
          <Block marginLeft={2}>
            <Block display="flex" alignItems="center">
              <Img src={deleteIcon} alt="Delete Icon" height="16px" />
              <Typography variant="body1" weight="semibold">
                Delete
              </Typography>
            </Block>
          </Block>
        )}
        {props.status === 'Ended' && (
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
        )}
      </Block>
      {props.status !== 'Ended' && (
        <Block padding={1} bgcolor="#d8d8d8" borderRadius="16px">
          <Typography variant="body1">
            This poll results will be available until {props.expiryDate.toLocaleDateString('es-ES')}
          </Typography>
        </Block>
      )}
      {props.status === 'Ended' && (
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
      )}
    </React.Fragment>
  );
};

export default Status;
