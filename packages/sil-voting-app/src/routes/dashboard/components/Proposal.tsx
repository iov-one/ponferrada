import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React, { useState } from 'react';

const DESC_MAX_LENGTH = 180;

export interface Props {
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

const Proposal = (props: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  const onClick = (): void => {
    setExpanded(!expanded);
  };

  return (
    <Block key={props.title} width="100%" display="flex" alignItems="center">
      <Block flexGrow={1} margin={2}>
        <Block display="flex" alignItems="center">
          <Typography variant="h6">{props.title}</Typography>
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
                {props.description.substring(0, DESC_MAX_LENGTH)}
                {'... '}
                <span onClick={onClick}>Read more</span>
              </Typography>
            )}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Typography variant="body1">
                {props.description} <span onClick={onClick}>Read less</span>
              </Typography>
            </Collapse>
          </React.Fragment>
        )}
        <Block display="flex" alignItems="center">
          <Typography variant="body1">Expires on {props.expiryDate.toLocaleDateString('es-ES')}</Typography>
          <Block marginLeft={2}>
            <Typography variant="body1">
              Created on {props.creationDate.toLocaleDateString('es-ES')}
            </Typography>
          </Block>
          <Block marginLeft={2}>
            <Typography variant="body1">Delete</Typography>
          </Block>
        </Block>
      </Block>
      <Block minWidth="205px" margin={2} display="flex" flexDirection="column">
        <Typography variant="body1">Your Vote:</Typography>
        <Button>Yes</Button>
        <Button>No</Button>
        <Button>Abstain</Button>
      </Block>
    </Block>
  );
};

export default Proposal;
