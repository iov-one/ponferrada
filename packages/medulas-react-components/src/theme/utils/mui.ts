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
      lineHeight: '3.3rem',
      fontWeight: lightFont,
    },
    h5: {
      fontSize: '1.25rem',
      lineHeight: '2rem',
      fontWeight: lightFont,
    },
    h6: {
      fontSize: '1.25rem',
      lineHeight: '130%',
      fontWeight: lightFont,
      color: secondaryColor,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: '130%',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: '130%',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: semiBoldFont,
      lineHeight: '100%',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: semiBoldFont,
      lineHeight: '100%',
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
