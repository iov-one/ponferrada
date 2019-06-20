import { storiesOf } from '@storybook/react';
import React from 'react';
import RecoveryPhraseIcon from '../../theme/assets/badgeIcon/recoveryPhrase.svg';
import { Storybook } from '../../utils/storybook';
import BadgeIcon from './index';

storiesOf('Components', module).add(
  'Badge Icon',
  (): JSX.Element => (
    <Storybook>
      <div style={{ margin: '36px' }}>
        <BadgeIcon invisible={false} icon={RecoveryPhraseIcon} badge="check" />
      </div>
      <div style={{ margin: '36px' }}>
        <BadgeIcon invisible={false} icon={RecoveryPhraseIcon} badge="dot" color="primary" />
      </div>
    </Storybook>
  ),
);
