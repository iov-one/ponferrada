import { storiesOf } from '@storybook/react';
import React from 'react';
import { Storybook } from '../../utils/storybook';
import MatchMedia, { MatchMediaContext } from './index';
import Typography from '../../components/Typography';

const MatchMediaStorybook = (): JSX.Element => {
  const isPhone = React.useContext(MatchMediaContext);

  return (
    <React.Fragment>
      {isPhone && <Typography>Phone sized screen</Typography>}
      {!isPhone && <Typography>Desktop sized screen</Typography>}
    </React.Fragment>
  );
};

storiesOf('Components', module).add(
  'MatchMedia',
  (): JSX.Element => (
    <Storybook>
      <MatchMedia>
        <MatchMediaStorybook />{' '}
      </MatchMedia>
    </Storybook>
  ),
);
