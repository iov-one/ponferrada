import { ClickAwayListener, createStyles, makeStyles, Popper, Theme } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import * as React from "react";

import { useOpen } from "../../hooks/open";
import infoNormal from "../../theme/assets/info_normal.svg";
import theme from "../../theme/utils/mui";
import Block from "../Block";
import Typography from "../Typography";

const DEFAULT_HEIGHT = 16;

const useStyles = makeStyles(
  (theme: Theme): ReturnType<typeof createStyles> => ({
    paper: {
      padding: theme.spacing(0.5),
      boxShadow: `0 0 14px 0 #edeff4`,
      backgroundColor: theme.palette.primary.main,
    },
    container: {
      // height: `${DEFAULT_HEIGHT}px`,
      display: "inline-block",
    },
    popper: {
      zIndex: 1,
      '&[x-placement*="bottom"] $arrow': {
        top: 0,
        left: 0,
        marginTop: "-0.9em",
        width: "3em",
        height: "1em",
        "&::before": {
          borderWidth: "0 1em 1em 1em",
          borderColor: `transparent transparent ${theme.palette.primary.main} transparent`,
        },
      },
      '&[x-placement*="top"] $arrow': {
        bottom: 0,
        left: 0,
        marginBottom: "-0.9em",
        width: "3em",
        height: "1em",
        "&::before": {
          borderWidth: "1em 1em 0 1em",
          borderColor: `${theme.palette.primary.main} transparent transparent transparent`,
        },
      },
      '&[x-placement*="right"] $arrow': {
        left: 0,
        marginLeft: "-0.9em",
        height: "3em",
        width: "1em",
        "&::before": {
          borderWidth: "1em 1em 1em 0",
          borderColor: `transparent ${theme.palette.primary.main} transparent transparent`,
        },
      },
      '&[x-placement*="left"] $arrow': {
        right: 0,
        marginRight: "-0.9em",
        height: "3em",
        width: "1em",
        "&::before": {
          borderWidth: "1em 0 1em 1em",
          borderColor: `transparent transparent transparent ${theme.palette.primary.main}`,
        },
      },
    },
    arrow: {
      position: "absolute",
      fontSize: 7,
      width: "3em",
      height: "3em",
      "&::before": {
        content: '""',
        margin: "auto",
        display: "block",
        width: 0,
        height: 0,
        borderStyle: "solid",
      },
    },
  }),
);

interface Props {
  readonly children: React.ReactNode;
  readonly textToCopy: string;
  readonly maxWidth?: number;
}

const PopupCopy = ({ children, maxWidth = 200 }: Props): JSX.Element => {
  const [isOpen, toggle, clickAway] = useOpen();

  const [arrowRef, setArrowRef] = React.useState<HTMLSpanElement>();

  const tooltipRef = React.useRef(null);
  const classes = useStyles();

  const popperStyle = {
    marginTop: theme.spacing(1),
    maxWidth,
  };

  const arrowRefCb = React.useCallback((node: HTMLSpanElement | null): void => {
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

  const onMouseEnter = (): void => {
    if (!isOpen) {
      toggle();
    }
  };

  const onClose = (): void => {
    clickAway();
  };

  return (
    <Block className={classes.container} height={64} onMouseLeave={onClose} zIndex={999}>
      <div className={classes.container} ref={tooltipRef} onMouseEnter={onMouseEnter}>
        {children}
      </div>

      <Popper
        open={isOpen}
        className={classes.popper}
        style={popperStyle}
        anchorEl={tooltipRef.current}
        placement="bottom"
        modifiers={popperModifiers}
      >
        <span className={classes.arrow} ref={arrowRefCb} />
        <ClickAwayListener onClickAway={onClose}>
          <Paper className={classes.paper}>
            <Typography inline variant="body2" color="">
              Copy to clipboard
            </Typography>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Block>
  );
};

export default PopupCopy;
