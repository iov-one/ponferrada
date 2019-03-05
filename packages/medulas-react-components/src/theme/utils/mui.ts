import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { lightFont, white, secondaryColor, semiBoldFont } from './variables';

const themeObject: ThemeOptions = {
  palette: {
    primary: {
      main: '#31E6C9',
      contrastText: white,
    },
    secondary: {
      main: secondaryColor,
    },
    error: {
      main: '#ffb968',
    },
    text: {
      primary: '#1C1C1C',
      secondary: 'rgba(111, 116, 154, 0.47)',
    },
    background: {
      default: '#f5f7f9',
    },
    action: {
      disabled: white,
      disabledBackground: 'rgba(44, 208, 182, 0.40)',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: "'Muli', sans-serif",
    fontSize: 14,
    fontWeightLight: lightFont,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    h1: {
      fontSize: '7rem',
    },
    h2: {
      fontSize: '4.25rem',
    },
    h3: {
      fontSize: '3.25rem',
    },
    h4: {
      fontSize: '2.5rem',
      fontWeight: lightFont,
    },
    h5: {
      fontSize: '2rem',
    },
    h6: {
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      lineHeight: '1.15rem',
    },
    subtitle1: {
      fontSize: '1rem',
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: '0.875rem',
    },
  },
  overrides: {
    MuiButton: {
      label: {
        textTransform: 'capitalize',
      },
      contained: {
        boxShadow: 'none',
      },
      containedPrimary: {
        '&:hover': {
          backgroundColor: '#2cd0b6',
        },
      },
    },
  },
  //https://material-ui.com/customization/themes/#properties
  props: {
    MuiButton: {
      variant: 'contained',
      color: 'primary',
    },
  },
};

export default createMuiTheme(themeObject);
