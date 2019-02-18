import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import Button from './Button'


storiesOf('Button', module)

  .add('with text', () => (
      <Button onClick={action('clicked')}>Buttoon</Button>
  ))

  .add('with some emoji', () => (
      <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ))

  .add('with a theme provider', () => (
    <Button onClick={action('clicked')}>Button</Button>
  ))