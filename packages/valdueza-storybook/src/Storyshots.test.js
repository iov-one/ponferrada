import initStoryshots from '@storybook/addon-storyshots';

initStoryshots({
  framework: 'react',
  storyKindRegex: /^((?!.*?Test disabled).)*$/,
});
