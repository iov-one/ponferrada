import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import Button from './index'
import { Storybook } from "../../utils/storybook";


storiesOf('Button', module)

  .add('with text', () => (    
      <Button onClick={action('clicked')}>Button</Button>
  ))

  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ))

  .add('with a theme provider', () => (
    <Storybook>
      <Button onClick={action('clicked')}>Button</Button>
    </Storybook>
  ))