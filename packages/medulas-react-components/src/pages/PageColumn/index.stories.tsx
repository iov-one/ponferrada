import { storiesOf } from '@storybook/react';
import React from 'react';
import PageColumn from './index';
import { Storybook } from '../../utils/storybook';
import { action } from '@storybook/addon-actions';

const RenderHeader = (): JSX.Element => <React.Fragment />;
const FormRender = (): JSX.Element => <React.Fragment />;

storiesOf('Components/Pages', module)
  .addParameters({ viewport: { defaultViewport: 'responsive' } })
  .add(
    'PageColumn',
    (): JSX.Element => (
      <Storybook>
        <PageColumn
          icon="white"
          onSubmit={action('Page form submit')}
          primaryTitle="Page"
          secondaryTitle="column"
          subtitle="Storybook PageColumn component example."
          renderHeader={RenderHeader}
          formRender={FormRender}
          nextMsg="Continue"
        />
      </Storybook>
    ),
  );
