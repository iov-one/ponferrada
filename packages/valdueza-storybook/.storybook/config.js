import { StylesProvider } from '@material-ui/styles';
import { addDecorator, addParameters, configure } from '@storybook/react';
import React from 'react';
//https://github.com/storybooks/storybook/tree/next/addons/storyshots/storyshots-core#configure-jest-to-work-with-webpacks-requirecontext ("Macro" subsection)
import requireContext from 'require-context.macro';

const newViewports = {
  chromeExtension: {
    name: 'extension',
    styles: {
      width: '350px',
      height: '500px',
    },
  },
};

addParameters({
  viewport: { viewports: newViewports, defaultViewport: 'chromeExtension' },
});

const req = requireContext('../../../packages', true, /\.stories\.((js|ts)x?)$/);

// We need to add decorator for testing only, otherwise we will break visual control of the storybooks
if (process.env.NODE_ENV === 'test') {
  // This optional decorator removes the material UI style IDs for deterministic snapshots. See:
  // https://github.com/mui-org/material-ui/issues/9492
  // https://github.com/abrcdf1023/egroup-material/commit/a876a4b411fda490a53ee20179acc72fe6514aaa
  addDecorator(story => {
    const generateClassName = (rule, styleSheet) => `${styleSheet.options.classNamePrefix}-${rule.key}`;
    return (
      <StylesProvider generateClassName={generateClassName}>
        {story()}
      </StylesProvider>
    );
  });
}

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
