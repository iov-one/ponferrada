import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import Block from '../../../components/Block';
import Button from '../../../components/Button';
import Typography from '../../../components/Typography';
import { Storybook } from '../../../utils/storybook';
import { ToastContext, ToastProvider } from '../index';
import { ToastVariant } from './index';
import ToastContent from './ToastContent';

const ToastStorybook = (): JSX.Element => {
  const { show } = React.useContext(ToastContext);

  const onInfoToast = (): void => {
    show('Hi INFO', ToastVariant.INFO);
  };

  const onWarnToast = (): void => {
    show('Hi WARN', ToastVariant.WARNING);
  };

  const onErrToast = (): void => {
    show('Hi ERR', ToastVariant.ERROR);
  };

  return (
    <Block>
      <Block marginBottom={10}>
        <Block marginBottom={2}>
          <Button onClick={onInfoToast}>Click to generate INFO toast</Button>
        </Block>
        <Typography>This should generate...</Typography>
        <ToastContent
          message="Hi INFO this is a cool feature. Stay tuned"
          onClose={action('closing')}
          variant={ToastVariant.INFO}
        />
      </Block>
      <Block marginBottom={10}>
        <Block marginBottom={2}>
          <Button onClick={onWarnToast}>Click to generate WARN toast</Button>
        </Block>
        <Typography>This should generate...</Typography>
        <ToastContent message="Hi WARN" onClose={action('closing')} variant={ToastVariant.WARNING} />
      </Block>
      <Block marginBottom={10}>
        <Block marginBottom={2}>
          <Button onClick={onErrToast}>Click to generate ERROR toast</Button>
        </Block>
        <Typography>This should generate...</Typography>
        <ToastContent message="Hi ERR" onClose={action('closing')} variant={ToastVariant.ERROR} />
      </Block>
    </Block>
  );
};

storiesOf('Components', module).add(
  'Toasts',
  (): JSX.Element => (
    <Storybook>
      <ToastProvider>
        <ToastStorybook />{' '}
      </ToastProvider>
    </Storybook>
  ),
);
