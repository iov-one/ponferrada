import { Fab, makeStyles, Theme } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import CircleImage from 'medulas-react-components/lib/components/Image/CircleImage';
import Typography from 'medulas-react-components/lib/components/Typography';
import * as React from 'react';

import { getBorderColor } from '../../../../theme/css';
import download from '../../assets/download.svg';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: 'auto',
    justifyContent: 'left',
    textTransform: 'inherit',
  },
  sizeSmall: {
    height: `${theme.spacing(4)}px`,
  },
  text: {
    paddingLeft: '4px',
  },
  secondary: {
    backgroundColor: theme.palette.background.default,
    padding: 0,
    boxShadow: 'none',
    border: `1px solid ${getBorderColor(theme)}`,
    '&:hover': {
      background: theme.palette.background.default,
    },
  },
  panel: {
    height: 64,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
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
    <Block className={classes.panel} padding="lg">
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
          circleColor="primary"
          alt="Download"
          dia={diameter}
          width={16}
          height={16}
        />
        <Typography variant="subtitle2" weight="regular" className={classes.text}>
          Export as .CSV
        </Typography>
      </Fab>
    </Block>
  );
};

export default DownloadCSV;
