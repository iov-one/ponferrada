import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";
import {
  fontColor,
  primary,
  secondary,
  temporaryError,
  lightFont,
  regularFont,
  semiBoldFont,
  mediumFontSize,
} from "./variables";

const palette = {
  primary: {
    main: primary,
  },
  secondary: {
    main: secondary,
  },
  error: {
    main: temporaryError,
  },
  contrastThreshold: 3,
  tonalOffset: 0.2,
};

const secondaryDegraded = "rgba(111, 116, 154, 0.47)";

export const themeObject: ThemeOptions = {
  typography: {
    useNextVariants: true,
    fontFamily: "Muli",
    fontSize: 14,
    fontWeightLight: lightFont,
    fontWeightRegular: regularFont,
    fontWeightMedium: semiBoldFont,
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "capitalize",
        minHeight: "42px",
        fontSize: mediumFontSize,
      },
      contained: {
        boxShadow: "none",
      },
      containedPrimary: {
        color: "#ffffff",
      },
      sizeLarge: {
        minHeight: "50px",
        fontSize: "19px",
      },
    },
    MuiIconButton: {
      root: {
        padding: `12px 8px`,
        "&:hover": {
          backgroundColor: "none",
        },
      },
    },
    MuiTypography: {
      // @ts-ignore: type def does not recognise this prop. Probably outdated.
      colorTextPrimary: {
        color: fontColor,
      },
      colorTextSecondary: {
        color: secondaryDegraded,
      },
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
        color: fontColor,
      },
      h5: {
        fontSize: "2rem",
      },
      h6: {
        fontSize: "1.25rem",
        color: fontColor,
      },
      body1: {
        fontSize: "1rem",
        color: fontColor,
      },
      body2: {
        lineHeight: "1.15rem",
        color: fontColor,
      },
      subtitle2: {
        fontSize: "0.875rem",
        lineHeight: "0.875rem",
        color: fontColor,
      },
    },
  },
  props: {},
  shadows: [
    "none",
    "0px 1px 3px 0px #edeff4,0px 1px 1px 0px #f3f4fb,0px 2px 1px -1px rgba(237, 239, 244, 0.14)",
    "0px 1px 5px 0px #edeff4,0px 2px 2px 0px #f3f4fb,0px 3px 1px -2px rgba(237, 239, 244, 0.14)",
    "0px 1px 8px 0px #edeff4,0px 3px 4px 0px #f3f4fb,0px 3px 3px -2px rgba(237, 239, 244, 0.14)",
    "0px 2px 4px -1px #edeff4,0px 4px 5px 0px #f3f4fb,0px 1px 10px 0px rgba(237, 239, 244, 0.14)",
    "0px 3px 5px -1px #edeff4,0px 5px 8px 0px #f3f4fb,0px 1px 14px 0px rgba(237, 239, 244, 0.14)",
    "0px 3px 5px -1px #edeff4,0px 6px 10px 0px #f3f4fb,0px 1px 18px 0px rgba(237, 239, 244, 0.14)",
    "0px 4px 5px -2px #edeff4,0px 7px 10px 1px #f3f4fb,0px 2px 16px 1px rgba(237, 239, 244, 0.14)",
    "0px 5px 5px -3px #edeff4,0px 8px 10px 1px #f3f4fb,0px 3px 14px 2px rgba(237, 239, 244, 0.14)",
    "0px 5px 6px -3px #edeff4,0px 9px 12px 1px #f3f4fb,0px 3px 16px 2px rgba(237, 239, 244, 0.14)",
    "0px 6px 6px -3px #edeff4,0px 10px 14px 1px #f3f4fb,0px 4px 18px 3px rgba(237, 239, 244, 0.14)",
    "0px 6px 7px -4px #edeff4,0px 11px 15px 1px #f3f4fb,0px 4px 20px 3px rgba(237, 239, 244, 0.14)",
    "0px 7px 8px -4px #edeff4,0px 12px 17px 2px #f3f4fb,0px 5px 22px 4px rgba(237, 239, 244, 0.14)",
    "0px 7px 8px -4px #edeff4,0px 13px 19px 2px #f3f4fb,0px 5px 24px 4px rgba(237, 239, 244, 0.14)",
    "0px 7px 9px -4px #edeff4,0px 14px 21px 2px #f3f4fb,0px 5px 26px 4px rgba(237, 239, 244, 0.14)",
    "0px 8px 9px -5px #edeff4,0px 15px 22px 2px #f3f4fb,0px 6px 28px 5px rgba(237, 239, 244, 0.14)",
    "0px 8px 10px -5px #edeff4,0px 16px 24px 2px #f3f4fb,0px 6px 30px 5px rgba(237, 239, 244, 0.14)",
    "0px 8px 11px -5px #edeff4,0px 17px 26px 2px #f3f4fb,0px 6px 32px 5px rgba(237, 239, 244, 0.14)",
    "0px 9px 11px -5px #edeff4,0px 18px 28px 2px #f3f4fb,0px 7px 34px 6px rgba(237, 239, 244, 0.14)",
    "0px 9px 12px -6px #edeff4,0px 19px 29px 2px #f3f4fb,0px 7px 36px 6px rgba(237, 239, 244, 0.14)",
    "0px 10px 13px -6px #edeff4,0px 20px 31px 3px #f3f4fb,0px 8px 38px 7px rgba(237, 239, 244, 0.14)",
    "0px 10px 13px -6px #edeff4,0px 21px 33px 3px #f3f4fb,0px 8px 40px 7px rgba(237, 239, 244, 0.14)",
    "0px 10px 14px -6px #edeff4,0px 22px 35px 3px #f3f4fb,0px 8px 42px 7px rgba(237, 239, 244, 0.14)",
    "0px 11px 14px -7px #edeff4,0px 23px 36px 3px #f3f4fb,0px 9px 44px 8px rgba(237, 239, 244, 0.14)",
    "0px 11px 15px -7px #edeff4,0px 24px 38px 3px #f3f4fb,0px 9px 46px 8px rgba(237, 239, 244, 0.14)",
  ],
  palette,
};

export default createMuiTheme(themeObject);
