import 'normalize.css';

import makeStyles from 'medulas-react-components/lib/theme/utils/styles';

export const globalStyles = makeStyles({
  '@global': {
    '*': {
      boxSizing: 'inherit',
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
    },
    '*::before, *::after': {
      boxSizing: 'inherit',
    },
    html: {
      fontSize: '62.5%',
    },
    body: {
      margin: '0',
      padding: '0',
      fontFamily: '"Muli", sans-serif',
      boxSizing: 'border-box',
    },
  },
});
