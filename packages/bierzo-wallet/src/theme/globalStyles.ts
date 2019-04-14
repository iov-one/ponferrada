import makeStyles from 'medulas-react-components/lib/theme/utils/styles';
import 'normalize.css';

export const globalStyles = makeStyles({
  '@global': {
    '*': {
      //outline: '1px solid blue !important',
      margin: '0',
      padding: '0',
      boxSizing: 'inherit',
    },

    html: {
      fontSize: '62.5%',
    },

    body: {
      fontFamily: '"Muli", sans-serif',
      boxSizing: 'border-box',
    },
  },
});
