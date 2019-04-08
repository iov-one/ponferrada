import { storiesOf } from '@storybook/react';
import React from 'react';
import Image from './index';
import { Storybook } from '../../utils/storybook';
import iovLogo from './assets/iov-logo.png';

storiesOf('Components', module).add(
  'Images',
  (): JSX.Element => (
    <Storybook>
      <Image src={iovLogo} alt="Iov Logo" />
    </Storybook>
  )
);
