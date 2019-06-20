import { storiesOf } from '@storybook/react';
import React from 'react';
import RecoveryPhraseIcon from '../../theme/assets/badgeIcon/recoveryPhrase.svg';
import { Storybook } from '../../utils/storybook';
import Block from '../Block';
import Img from '../Image';
import Badge from './index';

storiesOf('Components', module).add(
  'Badge Icon',
  (): JSX.Element => (
    <Storybook>
      <div style={{ margin: '36px' }}>
        <Block marginBottom={3}>This shows the check variant</Block>
        <Badge variant="check">
          <Img src={RecoveryPhraseIcon} alt="Icon" />
        </Badge>
      </div>
      <div style={{ margin: '36px' }}>
        <Block marginBottom={2}>This shows the badge variant</Block>
        <Badge variant="dot">
          <Img src={RecoveryPhraseIcon} alt="Icon" />
        </Badge>
      </div>
      <div style={{ margin: '36px' }}>
        <Block marginBottom={2}>This shows the error badge variant</Block>
        <Badge variant="dot" color="error">
          <Img src={RecoveryPhraseIcon} alt="Icon" />
        </Badge>
      </div>
      <div style={{ margin: '36px' }}>
        <Block marginBottom={2}>This shows the invisible variant</Block>
        <Badge variant="dot" invisible>
          <Img src={RecoveryPhraseIcon} alt="Icon" />
        </Badge>
      </div>
    </Storybook>
  ),
);
