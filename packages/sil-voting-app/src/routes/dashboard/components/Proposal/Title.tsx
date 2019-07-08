import Block from 'medulas-react-components/lib/components/Block';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

import { elipsify } from '../../../../utils/strings';

const TITLE_MAX_LENGTH = 30;

interface Props {
  readonly title: string;
  readonly status: 'Active' | 'Submitted' | 'Ended';
}

const Title = (props: Props): JSX.Element => {
  return (
    <Block display="flex" alignItems="center" marginBottom={1}>
      <Typography variant="h6">{elipsify(props.title, TITLE_MAX_LENGTH)}</Typography>
      <Block marginLeft={2}>
        <Typography variant="body1">{props.status}</Typography>
      </Block>
    </Block>
  );
};

export default Title;
