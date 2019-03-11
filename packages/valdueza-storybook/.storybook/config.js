import { configure } from '@storybook/react';
import requireContext from 'require-context.macro';


const req = requireContext('../../../packages', true, /\.stories\.((js|ts)x?)$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
