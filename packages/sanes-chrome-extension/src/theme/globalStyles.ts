import theme from 'medulas-react-components/lib/theme/utils/mui';
import makeStyles from 'medulas-react-components/lib/theme/utils/styles';

import { EXTENSION_HEIGHT, EXTENSION_WIDTH } from './constants';

export const globalStyles = makeStyles({
  '@global': {
    'html, body': {
      width: `${EXTENSION_WIDTH}px`,
      height: `${EXTENSION_HEIGHT}px`,
      '-ms-overflow-style': '-ms-autohiding-scrollbar',
      fontSize: '10px',
    },
    body: {
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
      overflowX: 'hidden',
      fontFamily: "'Muli', sans-serif",
      margin: 0,
      backgroundColor: theme.palette.background.default,
      textRendering: 'geometricPrecision',
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    },
  },
});
