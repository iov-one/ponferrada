import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";
import { lightFont } from "./variables";

export const themeObject: ThemeOptions = {
  palette: {
    primary: {
      main: "#31E6C9",
    },
    secondary: {
      main: "#6F749A",
    },
    error: {
      main: "#ffb968",
    },
    text: {
      primary: "#1C1C1C",
      secondary: "rgba(111, 116, 154, 0.47)",
    },
    background: {
      default: "#f5f7f9",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: "'Muli', sans-serif",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    h1: {
      fontSize: "7rem",
    },
    h2: {
      fontSize: "4.25rem",
    },
    h3: {
      fontSize: "3.25rem",
    },
    h4: {
      fontSize: "2.5rem",
      fontWeight: lightFont,
    },
    h5: {
      fontSize: "2rem",
    },
    h6: {
      fontSize: "1.25rem",
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      lineHeight: "1.15rem",
    },
    subtitle2: {
      fontSize: "0.875rem",
      lineHeight: "0.875rem",
    },
    button: {
      fontFamily: "'Muli', sans-serif",
    },
  },
  overrides: {
    MuiButton: {},
    MuiIconButton: {
      root: {
        padding: `12px 8px`,
        "&:hover": {
          backgroundColor: "none",
        },
      },
    },
  },
  //https://material-ui.com/customization/themes/#properties
  props: {},
};

export default createMuiTheme(themeObject);
