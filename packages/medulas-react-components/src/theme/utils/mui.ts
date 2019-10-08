import grey from "@material-ui/core/colors/grey";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

import { backgroundColor, lightFont, secondaryColor, white } from "./variables";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#31E6C9",
      contrastText: white,
    },
    secondary: {
      main: secondaryColor,
    },
    error: {
      main: "#ffb968",
    },
    text: {
      primary: "#6F749A",
      secondary: "rgba(111, 116, 154, 0.47)",
    },
    background: {
      default: backgroundColor,
      paper: "#ffffff",
    },
    action: {
      disabled: white,
      disabledBackground: "rgba(44, 208, 182, 0.40)",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: "'Muli', sans-serif",
    fontSize: 10,
    fontWeightLight: lightFont,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    h1: {
      fontSize: "9.8rem",
    },
    h2: {
      fontSize: "6rem",
    },
    h3: {
      fontSize: "4.5rem",
    },
    h4: {
      fontSize: "3.5rem",
      fontWeight: lightFont,
    },
    h5: {
      fontSize: "3.2rem",
    },
    h6: {
      fontSize: "1.8rem",
    },
    body1: {
      fontSize: "1.6rem",
    },
    body2: {
      fontSize: "1.4rem",
      lineHeight: "1.6rem",
    },
    subtitle1: {
      fontSize: "1.6rem",
    },
    subtitle2: {
      fontSize: "1.4rem",
      lineHeight: "1.4rem",
    },
  },
});

const themeObject: ThemeOptions = {
  ...theme,

  overrides: {
    MuiBackdrop: {
      root: {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
    },
    MuiButton: {
      root: {
        fontSize: "1.6rem",
      },
      label: {
        textTransform: "capitalize",
      },
      contained: {
        boxShadow: "none",
      },
      containedPrimary: {
        "&:hover": {
          backgroundColor: "#2cd0b6",
        },
      },
      sizeLarge: {
        minHeight: "50px",
        fontSize: "1.9rem",
      },
    },
    MuiFormHelperText: {
      root: {
        fontSize: "1.4rem",
      },
      contained: {
        margin: `${theme.spacing(1)}px ${theme.spacing(0)}px`,
      },
    },
    MuiIconButton: {
      root: {
        "&:hover": {
          backgroundColor: "transparent",
        },
      },
    },
    MuiInputLabel: {
      formControl: {
        top: `-${theme.spacing(3)}px`,
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightMedium,
        "&$focused": {
          // Use text primary in TextField labels when focusing.
          color: `${theme.palette.text.primary}`,
        },
      },
      root: {
        "&$error": {
          // Maintain the text primary color on errored text fields when loosing focus
          color: `${theme.palette.text.primary} !important`,
        },
      },
    },
    // Those overrides are for dropdowns in select fields.
    MuiList: {
      root: {
        boxSizing: "border-box",
        border: `1px solid ${theme.palette.grey[300]}`,
        backgroundColor: "white",
      },
      padding: {
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
      },
    },
    MuiListItem: {
      dense: {
        paddingTop: 0,
        paddingBottom: `${theme.spacing(2)}px`, // TOFIX: https://github.com/mui-org/material-ui/issues/13672#issuecomment-441105931
      },
    },
    MuiListItemIcon: {
      root: {
        marginRight: 0,
        marginTop: "4px",
      },
    },
    MuiOutlinedInput: {
      root: {
        // Do not change border color in hover effect
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
          borderColor: grey[300],
        },
        // Make bolder border color when focused
        "&$focused $notchedOutline": {
          borderWidth: "1px",
          borderColor: grey[400],
        },
        // Specify notched color
        "& $notchedOutline": {
          borderColor: grey[300],
        },
        // Make lighter border color when disabled
        "&$disabled $notchedOutline": {
          borderColor: grey[200],
        },
        backgroundColor: "#fcfcfc",
        "&$error": {
          backgroundColor: "#fff1e1",
        },
      },
      input: {
        padding: "12px",
        fontSize: "1.6rem",
      },
      inputMultiline: {
        lineHeight: "1.8rem",
      },
    },
    MuiSnackbarContent: {
      root: {
        [theme.breakpoints.up("xs")]: {
          borderRadius: 2,
          boxShadow: "0 0 6px 0 #f3f4fb",
        },
        width: 350,
        backgroundColor: white,
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
        flexWrap: "nowrap",
      },
      message: {
        display: "flex",
        flexGrow: 1,
        padding: 0,
      },
      action: {
        flexGrow: 0,
        margin: 0,
        padding: 0,
        marginRight: 0,
      },
    },
    MuiSvgIcon: {
      root: {
        width: "2em",
        height: "2em",
      },
    },
  },
  // https://material-ui.com/customization/themes/#properties
  props: {
    MuiButton: {
      variant: "contained",
      color: "primary",
    },
    MuiTextField: {
      variant: "outlined",
      InputProps: {
        labelWidth: 0,
      },
    },
    MuiInputLabel: {
      shrink: true,
      variant: "standard",
    },
    MuiButtonBase: {
      disableRipple: true,
      disableTouchRipple: true,
    },
  },
};

export default createMuiTheme(themeObject);
