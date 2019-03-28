import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { lightFont, white, secondaryColor } from './variables';
import grey from '@material-ui/core/colors/grey';

const theme = createMuiTheme({
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
});

const themeObject: ThemeOptions = {
  ...theme,

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
    MuiOutlinedInput: {
      root: {
        '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
          borderColor: grey[300],
        },
        '& $notchedOutline': {
          borderColor: grey[300],
        },
        '&$disabled $notchedOutline': {
          borderColor: grey[200],
        },
        '&$focused': {
          '&:hover $notchedOutline': {
            borderColor: grey[300],
          },
        },
        backgroundColor: '#fcfcfc',
      },
      input: {
        padding: '14px',
      },
      error: {
        '&$focused': {
          '&:hover $notchedOutline': {
            borderColor: '#ffb968',
          },
        },
        '&:hover $notchedOutline': {
          borderColor: '#ffb968',
        },
        backgroundColor: '#fff1e1',
      },
    },
    MuiInputLabel: {
      formControl: {
        top: `-${theme.spacing(3)}px`,
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: theme.typography.fontSize,
        '&$focused': {
          color: `${theme.palette.text.primary} !important`,
        },
      },
      error: {
        color: `${theme.palette.text.primary} !important`,
      },
    },
    MuiFormHelperText: {
      contained: {
        margin: `${theme.spacing(1)}px ${theme.spacing(0)}px`,
      },
    },
  },
  //https://material-ui.com/customization/themes/#properties
  props: {
    MuiButton: {
      variant: 'contained',
      color: 'primary',
    },
    MuiTextField: {
      variant: 'outlined',
      InputProps: {
        labelWidth: 0,
      },
    },
    MuiInputLabel: {
      shrink: true,
      variant: 'standard',
    },
  },
};

export default createMuiTheme(themeObject);
