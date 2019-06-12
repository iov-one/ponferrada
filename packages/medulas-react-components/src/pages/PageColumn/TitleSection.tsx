import * as React from 'react';
import Block from '../../components/Block';
import Typography from '../../components/Typography';

interface Props {
  readonly primaryTitle: string;
  readonly secondaryTitle: string;
  readonly phone: boolean;
}

const TitleSection = ({ primaryTitle, secondaryTitle, phone }: Props): JSX.Element => (
  <Block padding={phone ? 3 : 6} maxWidth={450} margin={2}>
    <Typography variant="h4" color="primary" inline>
      {`${primaryTitle} `}
    </Typography>
    <Typography variant="h4" inline>
      {secondaryTitle}
    </Typography>
  </Block>
);

export default TitleSection;
