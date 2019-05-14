import { storiesOf } from '@storybook/react';
import React from 'react';
import Image from './index';
import CircleImage from './CircleImage';
import { Storybook } from '../../utils/storybook';
import iovLogo from './assets/iov-logo.png';
import download from '../../theme/assets/download.svg';
import Grid from '../Grid';
import GridItem from '../GridItem';
import theme from '../../theme/utils/mui';

storiesOf('Components', module).add(
  'Images',
  (): JSX.Element => {
    return (
      <Storybook>
        <Grid flexWrap="wrap" flexDirection="column">
          <GridItem marginBottom={4}>
            <Image src={iovLogo} alt="Iov Logo" />
          </GridItem>
          <GridItem marginBottom={4}>
            <CircleImage
              icon={download}
              circleColor={theme.palette.primary.main}
              alt="Download"
              dia={theme.spacing(4)}
              width={theme.spacing(2)}
              height={theme.spacing(2)}
            />
          </GridItem>
        </Grid>
      </Storybook>
    );
  },
);
