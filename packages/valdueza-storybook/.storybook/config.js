import { configure } from '@storybook/react';
//https://github.com/storybooks/storybook/tree/next/addons/storyshots/storyshots-core#configure-jest-to-work-with-webpacks-requirecontext ("Macro" subsection)
import requireContext from 'require-context.macro';


const req = requireContext('../../../packages', true, /\.stories\.((js|ts)x?)$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
