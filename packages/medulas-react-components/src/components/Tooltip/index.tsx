import { Popper, makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import * as React from 'react';
import Image from '../Image';
import infoNormal from '../../theme/assets/info_normal.svg';
import theme from '../../theme/utils/mui';
import { useOpen } from '~/hooks/open';

const DEFAULT_HEIGHT = 16;

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    boxShadow: `0 0 14px 0 #edeff4`,
  },
  container: {
    height: `${DEFAULT_HEIGHT}px`,
    display: 'inline',
  },
  popper: {
    zIndex: 1,
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${
          theme.palette.common.white
        } transparent`,
      },
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${
          theme.palette.common.white
        } transparent transparent transparent`,
      },
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${
          theme.palette.common.white
        } transparent transparent`,
      },
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${
          theme.palette.common.white
        }`,
      },
    },
  },
  arrow: {
    position: 'absolute',
    fontSize: 7,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  },
}));

interface Props {
  readonly children: React.ReactNode;
  readonly maxWidth?: number;
}

const Tooltip = ({ children, maxWidth = 200 }: Props): JSX.Element => {
  const [isOpen, toggle] = useOpen();

  const [arrowRef, setArrowRef] = React.useState<HTMLSpanElement>();

  const tooltipRef = React.useRef(null);
  const classes = useStyles();

  const popperStyle = {
    marginTop: theme.spacing(1),
    maxWidth,
  };

  const arrowRefCb = React.useCallback((node: HTMLSpanElement | null) => {
    if (node !== null) {
      setArrowRef(node);
    }
  }, []);

  const popperModifiers = {
    flip: {
      enabled: true,
    },
    arrow: {
      enabled: true,
      element: arrowRef,
    },
  };

  return (
    <React.Fragment>
      <div className={classes.container} ref={tooltipRef} onClick={toggle}>
        <Image
          src={infoNormal}
          alt="Info"
          width={DEFAULT_HEIGHT}
          height={DEFAULT_HEIGHT}
        />
      </div>

      <Popper
        open={isOpen}
        className={classes.popper}
        style={popperStyle}
        anchorEl={tooltipRef.current}
        placement="bottom-end"
        modifiers={popperModifiers}
      >
        <span className={classes.arrow} ref={arrowRefCb} />
        <Paper className={classes.paper}>{children}</Paper>
      </Popper>
    </React.Fragment>
  );
};

export default Tooltip;
