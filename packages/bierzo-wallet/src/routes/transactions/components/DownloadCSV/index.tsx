import { Fab, makeStyles, Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import Block from "medulas-react-components/lib/components/Block";
import CircleImage from "medulas-react-components/lib/components/Image/CircleImage";
import Typography from "medulas-react-components/lib/components/Typography";
import * as React from "react";

import { getBorderColor } from "../../../../theme/css";
import download from "../../assets/download.svg";

export const CSV_PADDING = 20;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "auto",
    justifyContent: "left",
    textTransform: "inherit",
  },
  sizeSmall: {
    height: `${theme.spacing(4)}px`,
    padding: "0 !important",
  },
  secondary: {
    backgroundColor: "white",
    color: theme.palette.text.primary,
    padding: 0,
    boxShadow: "none",
    border: `1px solid ${getBorderColor(theme)}`,
    "&:hover": {
      background: theme.palette.background.default,
    },
  },
}));

export interface DownloadCSVProps {
  readonly onDownloadCSV: () => void;
}

const DownloadCSV = ({ onDownloadCSV }: DownloadCSVProps): JSX.Element => {
  const theme = useTheme<Theme>();
  const classes = useStyles();

  const fabClasses = {
    secondary: classes.secondary,
    root: classes.root,
    sizeSmall: classes.sizeSmall,
  };
  const diameter = `${theme.spacing(4)}px`;

  return (
    <Block
      height={64}
      display="flex"
      alignItems="center"
      paddingTop={3}
      paddingBottom={3}
      paddingLeft={CSV_PADDING}
      paddingRight={CSV_PADDING}
      bgcolor="white"
    >
      <Fab
        variant="extended"
        size="small"
        color="secondary"
        aria-label="Export as CSV"
        classes={fabClasses}
        onClick={onDownloadCSV}
      >
        <CircleImage
          icon={download}
          circleColor={theme.palette.primary.main}
          alt="Download"
          dia={diameter}
          width={16}
          height={16}
        />
        <Block paddingLeft={1.5} paddingRight={1.5}>
          <Typography variant="subtitle2" weight="regular">
            Export as .CSV
          </Typography>
        </Block>
      </Fab>
    </Block>
  );
};

export default DownloadCSV;
