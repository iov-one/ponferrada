import { makeStyles } from '@material-ui/styles';


//That's the only way I found to implement different font-faces
const fontFaceExtraLight = makeStyles({
  '@global': {
    '@font-face': {
      fontFamily: 'Muli',
      fontStyle: "normal",
      fontWeight: 200,
      src: "local('Muli ExtraLight'), local('Muli-ExtraLight'), \
            url('./fonts/Muli/muli-v12-latin-200.woff2') format('woff2'), \
            url('./fonts/Muli/muli-v12-latin-200.woff') format('woff'), \
            url('./fonts/Muli/muli-v12-latin-200.ttf') format('truetype')",
    }
  }
});

const fontFaceLight = makeStyles({
  '@global': {
    '@font-face': {
      fontFamily: 'Muli',
      fontStyle: "normal",
      fontWeight: 300,
      src: "local('Muli Light'), local('Muli-Light'), \
            url('./fonts/Muli/muli-v12-latin-300.woff2') format('woff2'), \
            url('./fonts/Muli/muli-v12-latin-300.woff') format('woff'), \
            url('./fonts/Muli/muli-v12-latin-300.ttf') format('truetype')",
    }
  }
});

const fontFaceRegular = makeStyles({
  '@global': {
    '@font-face': {
      fontFamily: 'Muli',
      fontStyle: "normal",
      fontWeight: 400,
      src: "local('Muli Regular'), local('Muli-Regular'), \
            url('./fonts/Muli/muli-v12-latin-regular.woff2') format('woff2'), \
            url('./fonts/Muli/muli-v12-latin-regular.woff') format('woff'), \
            url('./fonts/Muli/muli-v12-latin-regular.ttf') format('truetype')",
    }
  }
});

const fontFaceSemiBold = makeStyles({
  '@global': {
    '@font-face': {
      fontFamily: 'Muli',
      fontStyle: "normal",
      fontWeight: 600,
      src: "local('Muli SemiBold'), local('Muli-SemiBold'), \
            url('./fonts/Muli/muli-v12-latin-600.woff2') format('woff2'), \
            url('./fonts/Muli/muli-v12-latin-600.woff') format('woff'), \
            url('./fonts/Muli/muli-v12-latin-600.ttf') format('truetype')",
    }
  }
});

const mainStyles = makeStyles({
  '@global': {
    "html, body": {
      height: "100%",
      width: "100%",
      "-ms-overflow-style": "-ms-autohiding-scrollbar",
    },
    body: {
      position: "absolute",
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
      overflowX: "hidden",
      fontFamily: "'Muli', sans-serif",
      margin: 0,
      backgroundColor: "#f5f7f9",
      textRendering: "geometricPrecision",
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
    },
    "body>div:first-child": {
      display: "flex",
      minHeight: "100%",
    }
  },
});

export const globalStyles = () => {
  fontFaceExtraLight();
  fontFaceLight();
  fontFaceRegular();
  fontFaceSemiBold();
  mainStyles();
}