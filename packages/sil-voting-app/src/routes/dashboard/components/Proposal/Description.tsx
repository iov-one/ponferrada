import Collapse from '@material-ui/core/Collapse';
import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React, { useState } from 'react';
import { elipsify } from '../../../../utils/strings';

const DESC_MAX_LENGTH = 180;

interface Props {
  readonly description: string;
}

const Description = (props: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  const onClick = (): void => {
    setExpanded(prevExpanded => !prevExpanded);
  };

  const ReadMore = (): JSX.Element => {
    return (
      <React.Fragment>
        <Typography inline variant="body1">
          {elipsify(props.description, DESC_MAX_LENGTH)}{' '}
        </Typography>
        <Typography inline link onClick={onClick} variant="body1" weight="semibold">
          Read more
        </Typography>
      </React.Fragment>
    );
  };

  const hasSmallDescription = props.description.length < DESC_MAX_LENGTH;

  if (hasSmallDescription) {
    return (
      <Block marginBottom={1}>
        <Typography variant="body1">{props.description}</Typography>
      </Block>
    );
  }

  return (
    <Block marginBottom={1}>
      {!expanded && <ReadMore />}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Typography inline variant="body1">
          {props.description}{' '}
        </Typography>
        <Typography inline link onClick={onClick} variant="body1" weight="semibold">
          Read less
        </Typography>
      </Collapse>
    </Block>
  );
};

export default Description;
