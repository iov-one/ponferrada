import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Block from 'medulas-react-components/lib/components/Block';
import Img from 'medulas-react-components/lib/components/Image';
import Typography from 'medulas-react-components/lib/components/Typography';
import React, { useState } from 'react';
import deleteIcon from '../../../assets/delete.svg';
import { elipsify } from '../../../utils/strings';

const TITLE_MAX_LENGTH = 30;
const DESC_MAX_LENGTH = 180;

export interface VoteResult {
  readonly yes: number;
  readonly no: number;
  readonly abstain: number;
}

interface VoteWinner {
  readonly vote: string;
  readonly percentage: number;
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

const Proposal = (props: ProposalProps): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  const onClick = (): void => {
    setExpanded(!expanded);
  };

  return (
    <Block width="100%" display="flex" alignItems="center">
      <Block flexGrow={1} margin={2}>
        <Block display="flex" alignItems="center">
          <Typography variant="h6">{elipsify(props.title, TITLE_MAX_LENGTH)}</Typography>
          <Block marginLeft={2}>
            <Typography variant="body1">{props.status}</Typography>
          </Block>
        </Block>
        <Block display="flex" alignItems="center">
          <Typography variant="body1">Author: {props.author}</Typography>
          <Block marginLeft={2}>
            <Typography variant="body1">Proposal ID: {props.id}</Typography>
          </Block>
          <Block marginLeft={2}>
            <Typography variant="body1">
              Created on {props.creationDate.toLocaleDateString('es-ES')}
            </Typography>
          </Block>
        </Block>
        {props.description.length < DESC_MAX_LENGTH && (
          <Typography variant="body1">{props.description}</Typography>
        )}
        {props.description.length >= DESC_MAX_LENGTH && (
          <React.Fragment>
            {!expanded && (
              <React.Fragment>
                <Typography inline variant="body1">
                  {elipsify(props.description, DESC_MAX_LENGTH)}{' '}
                </Typography>
                <Typography inline link onClick={onClick} variant="body1" weight="semibold">
                  Read more
                </Typography>
              </React.Fragment>
            )}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Typography inline variant="body1">
                {props.description}{' '}
              </Typography>
              <Typography inline link onClick={onClick} variant="body1" weight="semibold">
                Read less
              </Typography>
            </Collapse>
          </React.Fragment>
        )}
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
      </Block>
      <Block minWidth="100px" margin={2} display="flex" flexDirection="column">
        <Typography variant="body1">Your Vote:</Typography>
        <Block marginTop="4px" marginBottom="4px">
          <Button fullWidth variant={props.vote === 'Yes' ? 'contained' : 'outlined'}>
            Yes
          </Button>
        </Block>
        <Block marginTop="4px" marginBottom="4px">
          <Button fullWidth variant={props.vote === 'No' ? 'contained' : 'outlined'}>
            No
          </Button>
        </Block>
        <Block marginTop="4px" marginBottom="4px">
          <Button fullWidth variant={props.vote === 'Abstain' ? 'contained' : 'outlined'}>
            Abstain
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default Proposal;
