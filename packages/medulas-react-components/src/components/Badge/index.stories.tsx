import { storiesOf } from '@storybook/react';
import React from 'react';
import RecoveryPhraseIcon from '../../theme/assets/badgeIcon/recoveryPhrase.svg';
import { Storybook } from '../../utils/storybook';
import Img from '../Image';
import Badge from './index';

storiesOf('Components', module).add(
  'Badge Icon',
  (): JSX.Element => (
    <Storybook>
      <div style={{ margin: '36px' }}>
        <Badge variant="check">
          <Img src={RecoveryPhraseIcon} alt="Icon" />
        </Badge>
      </div>
      <div style={{ margin: '36px' }}>
        <Badge variant="dot">
          <Img src={RecoveryPhraseIcon} alt="Icon" />
        </Badge>
      </div>
    </Storybook>
  ),
);
