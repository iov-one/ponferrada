import { ClickAwayListener, createStyles, makeStyles, Popper, Theme } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import clipboardCopy from "clipboard-copy";
import * as React from "react";

import { useOpen } from "../../hooks/open";
import theme from "../../theme/utils/mui";
import Block from "../Block";

const DIV_OVERFLOW_HEIGHT = 64;
const POPUP_COPY_TO_TEXT = "Copy to clipboard";
const POPUP_COPIED_TEXT = "Copied!";

const useStyles = makeStyles(
  (theme: Theme): ReturnType<typeof createStyles> => ({
    paper: {
      padding: theme.spacing(0.5),
      boxShadow: `0 0 14px 0 #edeff4`,
      backgroundColor: theme.palette.primary.main,
      cursor: "pointer",
    },
    container: {
      display: "inline-block",
      position: "relative",
    },
    popupText: {
      color: "white",
      fontSize: "1.4rem",
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

const PopupCopy = ({ children, textToCopy, maxWidth = 200 }: Props): JSX.Element => {
  const [isOpen, toggle, clickAway] = useOpen();
  const [overflowVisible, setOverflowVisible] = React.useState<"visible" | "hidden">("hidden");
  const [popupText, setPopupText] = React.useState<string>(POPUP_COPY_TO_TEXT);

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

  const copyText = (): void => {
    clipboardCopy(textToCopy);
    setPopupText(POPUP_COPIED_TEXT);
  };

  const onMouseEnter = (): void => {
    if (!isOpen) {
      toggle();
      setOverflowVisible("visible");
      setPopupText(POPUP_COPY_TO_TEXT);
    }
  };

  const onClose = (): void => {
    clickAway();
    setOverflowVisible("hidden");
  };

  return (
    <React.Fragment>
      <Block className={classes.container}>
        <div className={classes.container} ref={tooltipRef} onMouseEnter={onMouseEnter}>
          {children}
        </div>
        <Block
          visibility={overflowVisible}
          onMouseEnter={onClose}
          height={DIV_OVERFLOW_HEIGHT}
          display="inline-block"
          position="absolute"
          width="100%"
          left={0}
        ></Block>
        <Block
          visibility={overflowVisible}
          height={DIV_OVERFLOW_HEIGHT - 10}
          display="inline-block"
          position="absolute"
          width="calc(100% - 10px)"
          top={5}
          left={5}
        ></Block>
      </Block>

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
          <Paper className={classes.paper} onClick={copyText}>
            <span className={classes.popupText}>{popupText}</span>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </React.Fragment>
  );
};

export default PopupCopy;
