import { storiesOf } from '@storybook/react';
import React from 'react';
import Image from './index';
import { Storybook } from '../../utils/storybook';
import iovLogo from './assets/iov-logo.png';

storiesOf('Image', module).add('Images', () => (
  <Storybook>
    <Image src={iovLogo} alt="Iov Logo" />
  </Storybook>
));
