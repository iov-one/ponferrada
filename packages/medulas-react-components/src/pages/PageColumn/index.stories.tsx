import { storiesOf } from '@storybook/react';
import React from 'react';
import PageColumn from './index';
import { Storybook } from '../../utils/storybook';
import Img from '../../components/Image';
import { action } from '@storybook/addon-actions';
import people from '../assets/People.svg';

const LeftMenu = (): JSX.Element => <Img src={people} alt="Log in Image" cover />;
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
          leftMenu={LeftMenu}
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
