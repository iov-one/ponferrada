import * as React from 'react';

import Block from '../../components/Block';
import Typography from '../../components/Typography';

interface Props {
  readonly primaryTitle: string;
  readonly secondaryTitle: string;
}

const TitleSection = ({ primaryTitle, secondaryTitle }: Props): JSX.Element => (
  <Block padding={6} maxWidth={450} marginTop={5} marginLeft={1} marginRight={1}>
    <Typography variant="h4" color="primary" inline>
      {`${primaryTitle} `}
    </Typography>
    <Typography variant="h4" inline>
      {secondaryTitle}
    </Typography>
  </Block>
);

export default TitleSection;
