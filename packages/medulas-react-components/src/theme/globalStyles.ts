import { makeStyles } from '@material-ui/styles';
import 'typeface-muli';

export const globalStyles = makeStyles({
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
  },
});
