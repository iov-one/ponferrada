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
    MuiFormHelperText: {
      contained: {
        margin: `${theme.spacing(1)}px ${theme.spacing(0)}px`,
      },
    },
    MuiInputLabel: {
      formControl: {
        top: `-${theme.spacing(3)}px`,
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: theme.typography.fontSize,
        '&$focused': {
          // Use text primary in TextField labels when focusing.
          color: `${theme.palette.text.primary}`,
        },
      },
      error: {
        // Maintain the text primary color on errored text fields when loosing focus
        color: `${theme.palette.text.primary} !important`,
      },
    },
    // Those overrides are for dropdowns in select fields.
    MuiList: {
      root: {
        boxSizing: 'border-box',
        border: `1px solid ${theme.palette.grey[300]}`,
        borderBottom: 'none',
        boxShadow: '0 10px 7px 0 rgba(237, 239, 244, 0.14)',
        backgroundColor: 'white',
      },
      padding: {
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
      },
    },
    MuiOutlinedInput: {
      root: {
        // Do not change border color in hover effect
        '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
          borderColor: grey[300],
        },
        // Make bolder border color when focused
        '&$focused $notchedOutline': {
          borderWidth: '1px',
          borderColor: grey[400],
        },
        // Specify notched color
        '& $notchedOutline': {
          borderColor: grey[300],
        },
        // Make lighter border color when disabled
        '&$disabled $notchedOutline': {
          borderColor: grey[200],
        },
        backgroundColor: '#fcfcfc',
      },
      input: {
        padding: '14px',
      },
      error: {
        backgroundColor: '#fff1e1',
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
