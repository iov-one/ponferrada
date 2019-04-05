import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Storybook } from '../../../utils/storybook';
import { Toast, ToastVariant } from './index';

storiesOf('Toasts', module)
  .add('Success', () => (
    <Storybook>
      <Toast
        open={true}
        onClose={action('closed')}
        message="Success toast"
        variant={ToastVariant.SUCCESS}
      />
    </Storybook>
  ))
  .add('Error', () => (
    <Storybook>
      <Toast
        open={true}
        onClose={action('closed')}
        message="Error toast"
        variant={ToastVariant.ERROR}
      />
    </Storybook>
  ))
  .add('Warning', () => (
    <Storybook>
      <Toast
        open={true}
        onClose={action('closed')}
        message="Warning toast"
        variant={ToastVariant.WARNING}
      />
    </Storybook>
  ));
