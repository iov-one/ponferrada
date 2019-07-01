import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React, { useState } from 'react';
import { elipsify } from '../../../utils/strings';

const TITLE_MAX_LENGTH = 30;
const DESC_MAX_LENGTH = 180;

export interface ProposalProps {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly description: string;
  readonly creationDate: Date;
  readonly expiryDate: Date;
  readonly quorum: number;
  readonly threshold: number;
  readonly vote: 'Invalid' | 'Yes' | 'No' | 'Abstain';
  readonly status: 'Active' | 'Submitted' | 'Ended';
}

const Proposal = (props: ProposalProps): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  const onClick = (): void => {
    setExpanded(!expanded);
  };

  return (
    <Block key={props.title} width="100%" display="flex" alignItems="center">
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
        </Block>
        {props.description.length < DESC_MAX_LENGTH && (
          <Typography variant="body1">{props.description}</Typography>
        )}

        {props.description.length >= DESC_MAX_LENGTH && (
          <React.Fragment>
            {!expanded && (
              <Typography variant="body1">
                {elipsify(props.description, DESC_MAX_LENGTH)}{' '}
                <Typography inline link onClick={onClick} variant="body1" weight="semibold">
                  Read more
                </Typography>
              </Typography>
            )}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Typography variant="body1">
                {props.description}{' '}
                <Typography inline link onClick={onClick} variant="body1" weight="semibold">
                  Read less
                </Typography>
              </Typography>
            </Collapse>
          </React.Fragment>
        )}
        <Block display="flex" alignItems="center">
          <Typography variant="body1" weight="semibold">
            Expires on {props.expiryDate.toLocaleDateString('es-ES')}
          </Typography>
          <Block marginLeft={2}>
            <Typography variant="body1">
              Created on {props.creationDate.toLocaleDateString('es-ES')}
            </Typography>
          </Block>
        </Block>
        {props.status !== 'Ended' && (
          <Typography variant="body1" weight="semibold">
            Delete
          </Typography>
        )}
        {props.status === 'Ended' && (
          <Block display="flex" alignItems="center">
            <Typography variant="body1" weight="semibold">
              Quorum {props.quorum}
            </Typography>
            <Block marginLeft={2}>
              <Typography variant="body1" weight="semibold">
                Total votes 99
              </Typography>
            </Block>
            <Block marginLeft={2}>
              <Typography variant="body1" weight="semibold">
                Result Yes
              </Typography>
            </Block>
          </Block>
        )}
        {props.status !== 'Ended' && (
          <Block padding={1} bgcolor="#d8d8d8" borderRadius="16px">
            <Typography variant="body1">
              This poll results will be available until {props.expiryDate.toLocaleDateString('es-ES')}
            </Typography>
          </Block>
        )}
      </Block>
      <Block minWidth="205px" margin={2} display="flex" flexDirection="column">
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
